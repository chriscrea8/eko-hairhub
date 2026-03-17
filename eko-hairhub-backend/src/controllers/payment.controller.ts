import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { PrismaClient, PaymentStatus, BookingStatus } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient();

const paystackApi = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${config.paystackSecretKey}`,
    'Content-Type': 'application/json',
  },
});

// POST /api/payments/initialize
// Initializes a Paystack payment for a booking
export const initializePayment = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user!.userId;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        service: true,
        payment: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    if (booking.customerId !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    if (booking.payment?.status === PaymentStatus.COMPLETED) {
      return res.status(400).json({ success: false, error: 'This booking has already been paid for.' });
    }

    // Generate unique reference
    const reference = `EKO-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create or update payment record
    let payment = await prisma.payment.upsert({
      where: { bookingId },
      update: { reference, status: PaymentStatus.PENDING },
      create: {
        bookingId,
        amount: booking.totalAmount,
        status: PaymentStatus.PENDING,
        reference,
        currency: 'NGN',
      },
    });

    // Initialize with Paystack (amount in kobo = naira * 100)
    const paystackResponse = await paystackApi.post('/transaction/initialize', {
      email: booking.customer.email,
      amount: Math.round(booking.totalAmount * 100),
      reference,
      currency: 'NGN',
      metadata: {
        bookingId,
        customerId: userId,
        serviceName: booking.service.name,
        custom_fields: [
          { display_name: 'Booking ID', variable_name: 'booking_id', value: bookingId },
          { display_name: 'Service', variable_name: 'service', value: booking.service.name },
        ],
      },
      callback_url: `${config.frontendUrl}/payment/verify?reference=${reference}`,
    });

    const { authorization_url, access_code } = paystackResponse.data.data;

    return res.json({
      success: true,
      data: {
        authorizationUrl: authorization_url,
        accessCode: access_code,
        reference,
        amount: booking.totalAmount,
      },
      message: 'Payment initialized. Redirecting to Paystack...',
    });
  } catch (error: any) {
    console.error('Initialize payment error:', error?.response?.data || error);
    return res.status(500).json({ success: false, error: 'Failed to initialize payment.' });
  }
};

// GET /api/payments/verify/:reference
// Verifies payment after redirect back from Paystack
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({ success: false, error: 'Payment reference is required.' });
    }

    // Verify with Paystack
    const paystackResponse = await paystackApi.get(`/transaction/verify/${reference}`);
    const transaction = paystackResponse.data.data;

    if (transaction.status !== 'success') {
      await prisma.payment.update({
        where: { reference },
        data: { status: PaymentStatus.FAILED },
      });
      return res.status(400).json({ success: false, error: 'Payment verification failed.', data: { status: transaction.status } });
    }

    // Update payment record
    const payment = await prisma.payment.update({
      where: { reference },
      data: {
        status: PaymentStatus.COMPLETED,
        paystackId: transaction.id.toString(),
        channel: transaction.channel,
        paidAt: new Date(transaction.paid_at),
        metadata: transaction,
      },
      include: { booking: { include: { service: true, stylist: { include: { user: true } } } } },
    });

    // Update booking status (payment received, still needs stylist acceptance)
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: BookingStatus.PENDING },
    });

    // Notify stylist of new paid booking
    await prisma.notification.create({
      data: {
        userId: payment.booking.stylist.userId,
        bookingId: payment.bookingId,
        title: 'New Paid Booking Request!',
        message: `Payment of ₦${payment.amount.toLocaleString()} received for ${payment.booking.service.name}. Please review and accept.`,
        type: 'payment_received',
      },
    });

    return res.json({
      success: true,
      data: {
        payment,
        booking: payment.booking,
        transaction: {
          reference: transaction.reference,
          amount: transaction.amount / 100,
          status: transaction.status,
          channel: transaction.channel,
          paidAt: transaction.paid_at,
        },
      },
      message: 'Payment verified successfully!',
    });
  } catch (error: any) {
    console.error('Verify payment error:', error?.response?.data || error);
    return res.status(500).json({ success: false, error: 'Failed to verify payment.' });
  }
};

// POST /api/payments/webhook
// Paystack webhook handler (backup verification)
export const paystackWebhook = async (req: Request, res: Response) => {
  try {
    const hash = crypto
      .createHmac('sha512', config.paystackWebhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ success: false, error: 'Invalid webhook signature.' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference } = event.data;

      const existingPayment = await prisma.payment.findUnique({ where: { reference } });
      if (existingPayment?.status === PaymentStatus.COMPLETED) {
        return res.json({ success: true, message: 'Already processed.' });
      }

      await prisma.payment.update({
        where: { reference },
        data: {
          status: PaymentStatus.COMPLETED,
          paidAt: new Date(event.data.paid_at),
          paystackId: event.data.id.toString(),
          channel: event.data.channel,
        },
      });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ success: false, error: 'Webhook processing failed.' });
  }
};

// GET /api/payments/booking/:bookingId
export const getPaymentByBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { bookingId },
      include: { booking: { select: { customerId: true, stylistProfileId: true } } },
    });

    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found.' });

    const { userId, role } = req.user!;
    if (role === 'CUSTOMER' && payment.booking.customerId !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    return res.json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch payment.' });
  }
};
