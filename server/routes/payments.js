import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { authenticateToken } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';
import User from '../models/User.js';
import { sendPaymentCompletedEmail, sendPaymentCompletedAdminEmail } from '../services/email/index.js';

const router = Router();

// Initialize Razorpay only if credentials are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Create Razorpay order for booking payment
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ error: 'Payment gateway not configured. Please contact support.' });

    const { bookingId } = req.body;
    const customerId = req.user.id;

    console.log('Creating payment order for booking:', { bookingId, customerId });

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      console.error('Invalid booking ID format:', bookingId);
      return res.status(400).json({ error: 'Invalid booking id' });
    }

    const booking = await Booking.findOne({ _id: bookingId, customer_id: customerId, status: 'confirmed' }).lean();
    console.log('Booking found:', { booking: !!booking, bookingId, customerId });
    if (!booking) {
      console.error('Booking not found or not confirmed:', { bookingId, customerId });
      return res.status(404).json({ error: 'Booking not found or not confirmed' });
    }

    // Allow creating a new order only if payment hasn't been completed
    if (booking.razorpay_order_id && booking.payment_status === 'completed') {
      console.error('Payment already completed for booking:', bookingId);
      return res.status(400).json({ error: 'Payment already completed for this booking' });
    }

    let vName = undefined;
    let venue = null;
    if (booking.venue_id && mongoose.Types.ObjectId.isValid(booking.venue_id)) {
      venue = await Venue.findById(booking.venue_id, { name: 1, price_per_day: 1 }).lean();
      vName = venue?.name;
    }

    // Recalculate payment amount using same logic as frontend modal
    const GST_RATE = 0.18;
    const PLATFORM_FEE_RATE = 0.10;

    // Calculate number of days same way as frontend
    let numberOfDays = 1;
    if (booking.dates_timings && Array.isArray(booking.dates_timings) && booking.dates_timings.length > 0) {
      numberOfDays = booking.dates_timings.length;
    } else if (booking.number_of_days) {
      numberOfDays = booking.number_of_days;
    }

    // Get price per day
    const pricePerDay = Number(venue?.price_per_day || booking.price_per_day || 0);
    if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) {
      console.error('Invalid price per day:', { pricePerDay, venue: venue?.price_per_day, booking: booking.price_per_day });
      return res.status(400).json({ error: 'Invalid venue price' });
    }

    // Calculate same way as frontend modal:
    // venueAmount → platformFee → gstFee → totalAmount
    const venueAmount = pricePerDay * numberOfDays;
    const platformFee = venueAmount * PLATFORM_FEE_RATE;
    const gstFee = (venueAmount + platformFee) * GST_RATE;
    const paymentAmount = Math.round(venueAmount + platformFee + gstFee);

    console.log('Calculating payment amount (modal-aligned):', {
      numberOfDays,
      pricePerDay,
      venueAmount,
      platformFee,
      gstFee,
      paymentAmount
    });

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      console.error('Final payment amount invalid:', paymentAmount);
      return res.status(400).json({ error: 'Invalid payment amount for booking' });
    }
    const amountPaise = Math.round(paymentAmount * 100);
    if (!Number.isInteger(amountPaise) || amountPaise < 100) {
      return res.status(400).json({ error: 'Payment amount must be at least ₹1.00' });
    }

    const shortId = String(bookingId).slice(-8);
    const ts = Date.now().toString().slice(-8);
    const safeReceipt = `b_${shortId}_${ts}`; // <= 40 chars

    const orderOptions = {
      amount: amountPaise,
      currency: 'INR',
      receipt: safeReceipt,
      notes: {
        booking_id: String(bookingId),
        venue_name: vName ? String(vName).slice(0, 60) : undefined,
        customer_id: String(customerId),
        event_date: booking.event_date ? new Date(booking.event_date).toISOString() : undefined,
        display_amount: String(booking.amount),
        payment_amount: String(paymentAmount)
      }
    };

    let order;
    try {
      order = await razorpay.orders.create(orderOptions);
    } catch (rzpErr) {
      const gatewayMsg = rzpErr?.error?.description || rzpErr?.message || 'Payment gateway order creation failed';
      console.error('Razorpay order create error:', rzpErr);
      return res.status(502).json({ error: gatewayMsg });
    }

    const paymentDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await Booking.updateOne(
      { _id: bookingId },
      {
        $set: {
          payment_amount: paymentAmount,
          razorpay_order_id: order.id,
          razorpay_payment_id: null,
          payment_status: 'pending',
          payment_initiated_at: new Date(),
          payment_deadline: paymentDeadline,
          payment_error_description: null
        }
      }
    );

    res.json({ success: true, order: { id: order.id, amount: order.amount, currency: order.currency, booking_id: bookingId, venue_name: vName }, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    const safeMessage = typeof error?.message === 'string' && error.message.length < 300 ? error.message : 'Failed to create payment order';
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      bookingId: req.body.bookingId,
      customerId: req.user?.id
    });
    res.status(500).json({ error: safeMessage });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', authenticateToken, async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ error: 'Payment gateway not configured. Please contact support.' });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;
    const customerId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(booking_id)) {
      return res.status(400).json({ error: 'Invalid booking id' });
    }

    const booking = await Booking.findOne({ _id: booking_id, customer_id: customerId, razorpay_order_id }).lean();
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
    if (expectedSignature !== razorpay_signature) return res.status(400).json({ error: 'Invalid payment signature' });

    const now = new Date();

    await Booking.updateOne(
      { _id: booking_id },
      {
        $set: {
          payment_status: 'completed',
          razorpay_payment_id,
          payment_completed_at: now,
          status: 'confirmed'
        }
      }
    );

    const updatedBooking = await Booking.findById(booking_id).lean();
    const venue = await Venue.findById(updatedBooking.venue_id, { name: 1, location: 1, owner_id: 1, capacity: 1, price_per_day: 1 }).lean();
    const customer = await User.findById(customerId, { name: 1, email: 1, phone: 1 }).lean();

    if (updatedBooking.customer_email) {
      try {
        await sendPaymentCompletedEmail(updatedBooking.customer_email, {
          customer_name: updatedBooking.customer_name || customer?.name || 'Valued Customer',
          venue_name: venue?.name || 'Venue',
          venue_location: venue?.location || 'Location',
          event_date: updatedBooking.event_date,
          booking_id: booking_id,
          amount: updatedBooking.payment_amount || updatedBooking.amount,
          dates_timings: updatedBooking.dates_timings || [],
          price_per_day: venue?.price_per_day || 0,
          payment_amount: updatedBooking.payment_amount || updatedBooking.amount
        });
      } catch (emailError) {
        console.error('Error sending payment completed email:', emailError);
      }
    }

    const adminEmail = process.env.Planzia_ADMIN_EMAIL || process.env.EMAIL_USER;
    if (adminEmail) {
      try {
        const owner = await User.findById(venue?.owner_id, { name: 1, email: 1, phone: 1 }).lean();

        await sendPaymentCompletedAdminEmail(adminEmail, {
          booking_id: booking_id,
          dates_timings: updatedBooking.dates_timings || [],
          price_per_day: venue?.price_per_day || 0,
          event_type: updatedBooking.event_type,
          guest_count: updatedBooking.guest_count,
          special_requirements: updatedBooking.special_requirements
        }, {
          name: venue?.name || 'Venue',
          location: venue?.location || 'Location',
          capacity: venue?.capacity || 0
        }, {
          name: owner?.name || 'Not provided',
          email: owner?.email || 'Not provided',
          phone: owner?.phone || 'Not provided'
        }, {
          name: customer?.name || 'Valued Customer',
          email: customer?.email || 'Not provided',
          phone: customer?.phone || 'Not provided'
        });
      } catch (emailError) {
        console.error('Error sending payment completed admin notification:', emailError);
      }
    }

    res.json({ success: true, message: 'Payment verified successfully', payment_id: razorpay_payment_id });
  } catch (error) {
    console.error('Error verifying payment:', error);
    const safeMessage = typeof error?.message === 'string' && error.message.length < 300 ? error.message : 'Payment verification failed';
    res.status(500).json({ error: safeMessage });
  }
});

// Get payment status for booking
router.get('/status/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const customerId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: 'Invalid booking id' });
    }
    const booking = await Booking.findOne({ _id: bookingId, customer_id: customerId }, { payment_status: 1, razorpay_order_id: 1, razorpay_payment_id: 1, amount: 1, payment_completed_at: 1 }).lean();
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

// Handle payment failure
router.post('/payment-failed', authenticateToken, async (req, res) => {
  try {
    const { booking_id, error_description } = req.body;
    const customerId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(booking_id)) {
      return res.status(400).json({ error: 'Invalid booking id' });
    }
    await Booking.updateOne({ _id: booking_id, customer_id: customerId }, { $set: { payment_status: 'failed', payment_error_description: error_description } });
    res.json({ success: true, message: 'Payment failure recorded' });
  } catch (error) {
    console.error('Error recording payment failure:', error);
    res.status(500).json({ error: 'Failed to record payment failure' });
  }
});

export default router;
