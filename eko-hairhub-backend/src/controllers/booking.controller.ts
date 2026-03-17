import { Request, Response } from 'express';
import { PrismaClient, BookingStatus } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient();

const STYLIST_INCLUDE = {
  user: { select: { id: true, fullName: true, email: true, avatar: true } },
};

const BOOKING_INCLUDE = {
  customer: { select: { id: true, fullName: true, email: true, phone: true, avatar: true } },
  stylist: { include: STYLIST_INCLUDE },
  service: true,
  hairstyle: true,
  payment: true,
  review: true,
};

// POST /api/bookings
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { stylistProfileId, serviceId, hairstyleId, locationType, address, scheduledAt, notes } = req.body;
    const customerId = req.user!.userId;

    // Validate required fields
    if (!stylistProfileId || !serviceId || !locationType || !scheduledAt) {
      return res.status(400).json({ success: false, error: 'Missing required booking fields.' });
    }

    // Fetch service to get price
    const service = await prisma.service.findFirst({
      where: { id: serviceId, stylistProfileId, isActive: true },
    });

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found or inactive.' });
    }

    // Fetch stylist to check home service fee
    const stylist = await prisma.stylistProfile.findUnique({ where: { id: stylistProfileId } });
    if (!stylist || stylist.status !== 'VERIFIED') {
      return res.status(404).json({ success: false, error: 'Stylist not found or not verified.' });
    }

    if (locationType === 'HOME' && !stylist.offersHomeService) {
      return res.status(400).json({ success: false, error: 'This stylist does not offer home service.' });
    }

    if (locationType === 'HOME' && !address) {
      return res.status(400).json({ success: false, error: 'Address is required for home service.' });
    }

    // Check for scheduling conflicts
    const scheduledDate = new Date(scheduledAt);
    const conflictEnd = new Date(scheduledDate.getTime() + service.duration * 60000);

    const conflict = await prisma.booking.findFirst({
      where: {
        stylistProfileId,
        status: { in: [BookingStatus.ACCEPTED, BookingStatus.PENDING] },
        scheduledAt: { gte: scheduledDate, lt: conflictEnd },
      },
    });

    if (conflict) {
      return res.status(409).json({ success: false, error: 'This time slot is not available. Please select another.' });
    }

    const homeServiceFee = locationType === 'HOME' ? (stylist.homeServiceFee || 0) : 0;
    const totalAmount = service.price + homeServiceFee;

    const booking = await prisma.booking.create({
      data: {
        customerId,
        stylistProfileId,
        serviceId,
        hairstyleId: hairstyleId || null,
        locationType,
        address: address || null,
        scheduledAt: scheduledDate,
        notes: notes || null,
        totalAmount,
        status: BookingStatus.PENDING,
      },
      include: BOOKING_INCLUDE,
    });

    // Create notification for stylist
    await prisma.notification.create({
      data: {
        userId: stylist.userId,
        bookingId: booking.id,
        title: 'New Booking Request',
        message: `${req.user!.email} has requested a booking for ${service.name} on ${scheduledDate.toLocaleDateString()}.`,
        type: 'booking_created',
      },
    });

    return res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully!',
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create booking.' });
  }
};

// GET /api/bookings (customer: own bookings; stylist: their bookings; admin: all)
export const getBookings = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { userId, role } = req.user!;
    const skip = (Number(page) - 1) * Number(limit);

    let where: any = {};

    if (role === 'CUSTOMER') {
      where.customerId = userId;
    } else if (role === 'STYLIST') {
      const profile = await prisma.stylistProfile.findUnique({ where: { userId } });
      if (!profile) return res.status(404).json({ success: false, error: 'Stylist profile not found.' });
      where.stylistProfileId = profile.id;
    }
    // ADMIN sees all

    if (status) where.status = status;

    const [bookings, total] = await prisma.$transaction([
      prisma.booking.findMany({ where, include: BOOKING_INCLUDE, orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
      prisma.booking.count({ where }),
    ]);

    return res.json({
      success: true,
      data: bookings,
      meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch bookings.' });
  }
};

// GET /api/bookings/:id
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;

    const booking = await prisma.booking.findUnique({ where: { id }, include: BOOKING_INCLUDE });
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });

    // Authorization check
    if (role === 'CUSTOMER' && booking.customerId !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }
    if (role === 'STYLIST' && booking.stylist.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    return res.json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch booking.' });
  }
};

// PATCH /api/bookings/:id/status (stylist accepts/rejects; customer cancels; admin manages)
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const { userId, role } = req.user!;

    const booking = await prisma.booking.findUnique({ where: { id }, include: { stylist: true, service: true } });
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });

    // Permission checks
    if (role === 'STYLIST') {
      if (booking.stylist.userId !== userId) {
        return res.status(403).json({ success: false, error: 'Access denied.' });
      }
      if (!['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Stylist can only accept, reject, or complete bookings.' });
      }
    }

    if (role === 'CUSTOMER') {
      if (booking.customerId !== userId) {
        return res.status(403).json({ success: false, error: 'Access denied.' });
      }
      if (status !== 'CANCELLED') {
        return res.status(400).json({ success: false, error: 'Customers can only cancel bookings.' });
      }
    }

    const updateData: any = { status };
    if (notes) updateData.stylistNotes = notes;
    if (status === 'COMPLETED') updateData.completedAt = new Date();
    if (status === 'CANCELLED') updateData.cancelledAt = new Date();

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: BOOKING_INCLUDE,
    });

    // Update stylist earnings if completed
    if (status === 'COMPLETED') {
      const earnings = booking.totalAmount * (1 - config.platformFeePercent / 100);
      await prisma.stylistProfile.update({
        where: { id: booking.stylistProfileId },
        data: { totalEarnings: { increment: earnings } },
      });
    }

    // Notification for customer
    const notifMessages: Record<string, string> = {
      ACCEPTED: `Your booking for ${booking.service.name} has been accepted! See you on ${booking.scheduledAt.toLocaleDateString()}.`,
      REJECTED: `Your booking for ${booking.service.name} was not accepted. ${notes ? 'Reason: ' + notes : ''}`,
      COMPLETED: `Your appointment for ${booking.service.name} is complete. Please leave a review!`,
    };

    if (notifMessages[status]) {
      await prisma.notification.create({
        data: {
          userId: booking.customerId,
          bookingId: id,
          title: `Booking ${status.charAt(0) + status.slice(1).toLowerCase()}`,
          message: notifMessages[status],
          type: `booking_${status.toLowerCase()}`,
        },
      });
    }

    return res.json({ success: true, data: updatedBooking, message: `Booking ${status.toLowerCase()} successfully.` });
  } catch (error) {
    console.error('Update booking status error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update booking status.' });
  }
};
