import { Request, Response } from 'express';
import { PrismaClient, StylistStatus } from '@prisma/client';

const prisma = new PrismaClient();

const STYLIST_INCLUDE = {
  user: { select: { id: true, fullName: true, email: true, phone: true, avatar: true, createdAt: true } },
  portfolioImages: { orderBy: { order: 'asc' as const } },
  services: { where: { isActive: true } },
  availability: { orderBy: { dayOfWeek: 'asc' as const } },
};

// GET /api/stylists
export const getStylists = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 12, area, specialty, offersHomeService, minRating, query } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { status: StylistStatus.VERIFIED };

    if (area) where.area = area;
    if (offersHomeService === 'true') where.offersHomeService = true;
    if (minRating) where.rating = { gte: Number(minRating) };
    if (specialty) where.specialties = { has: specialty as string };

    if (query) {
      where.OR = [
        { user: { fullName: { contains: query as string, mode: 'insensitive' } } },
        { bio: { contains: query as string, mode: 'insensitive' } },
        { area: { contains: query as string, mode: 'insensitive' } },
      ];
    }

    const [stylists, total] = await prisma.$transaction([
      prisma.stylistProfile.findMany({
        where,
        include: STYLIST_INCLUDE,
        orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
        skip,
        take: Number(limit),
      }),
      prisma.stylistProfile.count({ where }),
    ]);

    return res.json({
      success: true,
      data: stylists,
      meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    console.error('Get stylists error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch stylists.' });
  }
};

// GET /api/stylists/:id
export const getStylistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const stylist = await prisma.stylistProfile.findUnique({
      where: { id },
      include: {
        ...STYLIST_INCLUDE,
        reviews: {
          include: { customer: { select: { id: true, fullName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
          where: { isVisible: true },
        },
      },
    });

    if (!stylist) {
      return res.status(404).json({ success: false, error: 'Stylist not found.' });
    }

    return res.json({ success: true, data: stylist });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch stylist.' });
  }
};

// PATCH /api/stylists/profile (authenticated stylist updates own profile)
export const updateStylistProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { bio, specialties, location, area, offersHomeService, homeServiceFee, yearsExperience } = req.body;

    const updatedProfile = await prisma.stylistProfile.update({
      where: { userId },
      data: {
        bio: bio || undefined,
        specialties: specialties || undefined,
        location: location || undefined,
        area: area || undefined,
        offersHomeService: offersHomeService !== undefined ? offersHomeService : undefined,
        homeServiceFee: homeServiceFee || undefined,
        yearsExperience: yearsExperience || undefined,
      },
      include: STYLIST_INCLUDE,
    });

    return res.json({ success: true, data: updatedProfile, message: 'Profile updated.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
};

// POST /api/stylists/services
export const addService = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { name, description, price, duration, category } = req.body;

    if (!name || !price || !duration || !category) {
      return res.status(400).json({ success: false, error: 'Name, price, duration, and category are required.' });
    }

    const profile = await prisma.stylistProfile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ success: false, error: 'Stylist profile not found.' });

    const service = await prisma.service.create({
      data: { stylistProfileId: profile.id, name, description, price, duration, category },
    });

    return res.status(201).json({ success: true, data: service, message: 'Service added.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to add service.' });
  }
};

// DELETE /api/stylists/services/:id
export const deleteService = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const profile = await prisma.stylistProfile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found.' });

    const service = await prisma.service.findFirst({ where: { id, stylistProfileId: profile.id } });
    if (!service) return res.status(404).json({ success: false, error: 'Service not found.' });

    await prisma.service.update({ where: { id }, data: { isActive: false } });

    return res.json({ success: true, message: 'Service removed.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to remove service.' });
  }
};

// PUT /api/stylists/availability
export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { availability } = req.body; // Array of { dayOfWeek, startTime, endTime, isAvailable }

    const profile = await prisma.stylistProfile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found.' });

    // Upsert each day
    const updates = await prisma.$transaction(
      availability.map((day: { dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean }) =>
        prisma.availability.upsert({
          where: { stylistProfileId_dayOfWeek: { stylistProfileId: profile.id, dayOfWeek: day.dayOfWeek } },
          update: { startTime: day.startTime, endTime: day.endTime, isAvailable: day.isAvailable },
          create: { stylistProfileId: profile.id, ...day },
        })
      )
    );

    return res.json({ success: true, data: updates, message: 'Availability updated.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update availability.' });
  }
};

// GET /api/stylists/:id/earnings (stylist only)
export const getStylistEarnings = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const profile = await prisma.stylistProfile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found.' });

    const payments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        booking: { stylistProfileId: profile.id },
      },
      include: { booking: { include: { service: true, customer: { select: { fullName: true } } } } },
      orderBy: { paidAt: 'desc' },
    });

    const grossEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
    const platformFee = grossEarnings * 0.1;
    const netEarnings = grossEarnings - platformFee;

    return res.json({
      success: true,
      data: {
        grossEarnings,
        platformFee,
        netEarnings,
        transactions: payments,
        totalTransactions: payments.length,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch earnings.' });
  }
};
