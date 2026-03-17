import { Router } from 'express';
import { authenticate, requireAdmin, requireCustomer, requireStylist } from '../middleware/auth';

// Controllers
import * as authCtrl from '../controllers/auth.controller';
import * as stylistCtrl from '../controllers/stylist.controller';
import * as bookingCtrl from '../controllers/booking.controller';
import * as paymentCtrl from '../controllers/payment.controller';

// Inline simple controllers for reviews and hairstyles
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const router = Router();

// ============================================================
// AUTH ROUTES — /api/auth
// ============================================================
const authRouter = Router();
authRouter.post('/register', authCtrl.register);
authRouter.post('/login', authCtrl.login);
authRouter.get('/me', authenticate, authCtrl.getMe);
authRouter.post('/change-password', authenticate, authCtrl.changePassword);

// ============================================================
// STYLIST ROUTES — /api/stylists
// ============================================================
const stylistRouter = Router();
stylistRouter.get('/', stylistCtrl.getStylists);
stylistRouter.get('/:id', stylistCtrl.getStylistById);
stylistRouter.patch('/profile', authenticate, requireStylist, stylistCtrl.updateStylistProfile);
stylistRouter.post('/services', authenticate, requireStylist, stylistCtrl.addService);
stylistRouter.delete('/services/:id', authenticate, requireStylist, stylistCtrl.deleteService);
stylistRouter.put('/availability', authenticate, requireStylist, stylistCtrl.updateAvailability);
stylistRouter.get('/my/earnings', authenticate, requireStylist, stylistCtrl.getStylistEarnings);

// ============================================================
// HAIRSTYLE ROUTES — /api/hairstyles
// ============================================================
const hairstyleRouter = Router();

hairstyleRouter.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 20, query } = req.query;
    const where: any = { isActive: true };
    if (category) where.category = category;
    if (query) where.name = { contains: query as string, mode: 'insensitive' };
    const [hairstyles, total] = await prisma.$transaction([
      prisma.hairstyle.findMany({ where, orderBy: { popularityScore: 'desc' }, skip: (Number(page) - 1) * Number(limit), take: Number(limit) }),
      prisma.hairstyle.count({ where }),
    ]);
    return res.json({ success: true, data: hairstyles, meta: { total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) } });
  } catch (e) { return res.status(500).json({ success: false, error: 'Failed to fetch hairstyles.' }); }
});

hairstyleRouter.get('/:id', async (req, res) => {
  try {
    const style = await prisma.hairstyle.findUnique({ where: { id: req.params.id } });
    if (!style) return res.status(404).json({ success: false, error: 'Not found.' });
    return res.json({ success: true, data: style });
  } catch (e) { return res.status(500).json({ success: false, error: 'Failed.' }); }
});

hairstyleRouter.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const style = await prisma.hairstyle.create({ data: req.body });
    return res.status(201).json({ success: true, data: style });
  } catch (e) { return res.status(500).json({ success: false, error: 'Failed to create.' }); }
});

// ============================================================
// BOOKING ROUTES — /api/bookings
// ============================================================
const bookingRouter = Router();
bookingRouter.use(authenticate);
bookingRouter.post('/', bookingCtrl.createBooking);
bookingRouter.get('/', bookingCtrl.getBookings);
bookingRouter.get('/:id', bookingCtrl.getBookingById);
bookingRouter.patch('/:id/status', bookingCtrl.updateBookingStatus);

// ============================================================
// PAYMENT ROUTES — /api/payments
// ============================================================
const paymentRouter = Router();
paymentRouter.post('/webhook', paymentCtrl.paystackWebhook); // No auth (Paystack calls this)
paymentRouter.use(authenticate);
paymentRouter.post('/initialize', paymentCtrl.initializePayment);
paymentRouter.get('/verify/:reference', paymentCtrl.verifyPayment);
paymentRouter.get('/booking/:bookingId', paymentCtrl.getPaymentByBooking);

// ============================================================
// REVIEW ROUTES — /api/reviews
// ============================================================
const reviewRouter = Router();

reviewRouter.post('/', authenticate, requireCustomer, async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const customerId = req.user!.userId;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({ success: false, error: 'bookingId, rating and comment required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5.' });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.customerId !== customerId) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }
    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, error: 'Can only review completed bookings.' });
    }

    const existing = await prisma.review.findUnique({ where: { bookingId } });
    if (existing) return res.status(409).json({ success: false, error: 'Review already submitted.' });

    const review = await prisma.review.create({
      data: { bookingId, customerId, stylistProfileId: booking.stylistProfileId, rating, comment },
    });

    // Recalculate stylist rating
    const allReviews = await prisma.review.findMany({ where: { stylistProfileId: booking.stylistProfileId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.stylistProfile.update({
      where: { id: booking.stylistProfileId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length },
    });

    return res.status(201).json({ success: true, data: review, message: 'Review submitted!' });
  } catch (e) { return res.status(500).json({ success: false, error: 'Failed to submit review.' }); }
});

reviewRouter.get('/stylist/:stylistId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { stylistProfileId: req.params.stylistId, isVisible: true },
      include: { customer: { select: { id: true, fullName: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return res.json({ success: true, data: reviews });
  } catch (e) { return res.status(500).json({ success: false, error: 'Failed to fetch reviews.' }); }
});

// ============================================================
// USER ROUTES — /api/users
// ============================================================
const userRouter = Router();
userRouter.use(authenticate);

userRouter.get('/me', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, fullName: true, phone: true, avatar: true, role: true, createdAt: true },
    });
    return res.json({ success: true, data: user });
  } catch (e) { return res.status(500).json({ success: false, error: 'Failed.' }); }
});

userRouter.patch('/me', async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { fullName: fullName || undefined, phone: phone || undefined },
      select: { id: true, email: true, fullName: true, phone: true, avatar: true, role: true },
    });
    return res.json({ success: true, data: user, message: 'Profile updated.' });
  } catch (e) { return res.status(500).json({ success: false, error: 'Failed to update.' }); }
});

// ADMIN: list all users
userRouter.get('/', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const where: any = {};
    if (role) where.role = role;
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: { id: true, email: true, fullName: true, phone: true, role: true, isActive: true, createdAt: true },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    return res.json({ success: true, data: users, meta: { total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) } });
  } catch (e) { return res.status(500).json({ success: false, error: 'Failed.' }); }
});

// ADMIN: suspend user
userRouter.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive },
      select: { id: true, email: true, fullName: true, isActive: true },
    });
    return res.json({ success: true, data: user });
  } catch (e) { return res.status(500).json({ success: false, error: 'Failed.' }); }
});

// ADMIN: verify stylist
userRouter.patch('/stylists/:id/verify', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body; // VERIFIED or SUSPENDED
    const profile = await prisma.stylistProfile.update({ where: { id: req.params.id }, data: { status } });
    return res.json({ success: true, data: profile, message: `Stylist ${status.toLowerCase()} successfully.` });
  } catch (e) { return res.status(500).json({ success: false, error: 'Failed.' }); }
});

// Mount all routers
router.use('/auth', authRouter);
router.use('/stylists', stylistRouter);
router.use('/hairstyles', hairstyleRouter);
router.use('/bookings', bookingRouter);
router.use('/payments', paymentRouter);
router.use('/reviews', reviewRouter);
router.use('/users', userRouter);

export default router;
