import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';
import User from '../models/User.js';
import {
  sendVenueInquiryEmail,
  sendInquiryNotificationToPlanzia,
  sendBookingConfirmationEmail,
  sendBookingRejectionEmail,
  sendInquiryAcceptedToAdmin,
  sendInquiryAcceptedToCustomer,
  sendInquiryRejectedToAdmin,
  sendInquiryRejectedToCustomer
} from '../services/emailService.js';
import { triggerPaymentReminderForBooking } from '../services/bookingCleanupJob.js';

const router = Router();

// Helper function to convert 12-hour time string to 24-hour format
const convertTo24Hour = (hour, minute, period) => {
  let hour24 = parseInt(hour);
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  return { hour24, minute: parseInt(minute) };
};

// Helper function to create DateTime from date string and time components
const createDateTime = (dateStr, hour, minute, period) => {
  if (!dateStr || !hour || !minute || !period) {
    return null;
  }

  try {
    // dateStr can be YYYY-MM-DD or a Date object
    let date;
    if (typeof dateStr === 'string') {
      const [year, month, day] = dateStr.split('-');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      date = new Date(dateStr);
    }

    const { hour24, minute: min } = convertTo24Hour(hour, minute, period);
    date.setHours(hour24, min, 0, 0);
    return date;
  } catch (error) {
    console.error('Error creating datetime:', error);
    return null;
  }
};

// Helper function to convert dates_timings array with proper datetime conversion
const processDatesTimings = (datesTimings) => {
  if (!datesTimings || !Array.isArray(datesTimings)) {
    return [];
  }

  return datesTimings.map(item => {
    const { date: dateStr, timing } = item;
    if (!timing) {
      return null;
    }

    const { timeFromHour, timeFromMinute, timeFromPeriod, timeToHour, timeToMinute, timeToPeriod } = timing;

    // Validate time fields
    if (!timeFromHour || !timeFromMinute || !timeToHour || !timeToMinute) {
      console.warn('Incomplete timing data for date:', dateStr);
      return null;
    }

    const dateObj = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

    // Ensure dateObj is valid
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', dateStr);
      return null;
    }

    const datetime_from = createDateTime(dateStr, timeFromHour, timeFromMinute, timeFromPeriod);
    const datetime_to = createDateTime(dateStr, timeToHour, timeToMinute, timeToPeriod);

    return {
      date: dateObj,
      datetime_from,
      datetime_to,
      timing: {
        timeFromHour: String(timeFromHour).trim(),
        timeFromMinute: String(timeFromMinute).padStart(2, '0'),
        timeFromPeriod: String(timeFromPeriod || 'AM').toUpperCase(),
        timeToHour: String(timeToHour).trim(),
        timeToMinute: String(timeToMinute).padStart(2, '0'),
        timeToPeriod: String(timeToPeriod || 'AM').toUpperCase()
      }
    };
  }).filter(item => item !== null);
};

// Get bookings for venue owner (protected)
router.get('/owner', authenticateToken, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { status, payment_status, limit = 20, offset = 0 } = req.query;

    const venueIds = await Venue.find({ owner_id: ownerId }, { _id: 1 }).lean();
    const filter = { venue_id: { $in: venueIds.map(v => v._id) } };
    if (status) filter.status = status;
    if (payment_status) filter.payment_status = payment_status;

    const bookings = await Booking.find(filter)
      .populate('venue_id', 'name location')
      .sort({ created_at: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .lean();

    const withVenue = bookings.map(b => ({
      ...b,
      venue_name: b.venue_id?.name,
      venue_location: b.venue_id?.location,
      amount: Number(b.amount),
      payment_amount: Number(b.payment_amount || b.amount)
    }));

    res.json(withVenue);
  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get customer bookings (protected)
router.get('/customer', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.id;
    const { status, payment_status, limit = 20, offset = 0 } = req.query;

    const filter = { customer_id: customerId };
    if (status) filter.status = status;
    if (payment_status) filter.payment_status = payment_status;

    const bookings = await Booking.find(filter)
      .populate({
        path: 'venue_id',
        select: 'name location owner_id',
        populate: {
          path: 'owner_id',
          select: 'name mobile_number'
        }
      })
      .sort({ created_at: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .lean();

    const withVenueOwner = bookings.map(b => ({
      ...b,
      venue_name: b.venue_id?.name,
      venue_location: b.venue_id?.location,
      owner_name: b.venue_id?.owner_id?.name,
      owner_phone: b.venue_id?.owner_id?.mobile_number,
      amount: Number(b.amount),
      payment_amount: Number(b.payment_amount || b.amount)
    }));

    res.json(withVenueOwner);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create new booking (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.id;
    const {
      venueId, eventDate, eventType, guestCount, amount,
      customerName, customerEmail, customerPhone, specialRequirements,
      eventTimeStart, eventTimeEnd, venueName, venueLocation, datesTimings
    } = req.body;

    if (!venueId || !eventDate || !guestCount || !amount || !customerName || !customerEmail) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const venue = await Venue.findById(venueId).lean();
    if (!venue || venue.status !== 'active') return res.status(404).json({ error: 'Venue not found or inactive' });

    if (guestCount > venue.capacity) {
      return res.status(400).json({ error: `Guest count exceeds venue capacity (${venue.capacity})` });
    }

    const sameDate = await Booking.findOne({ venue_id: venueId, event_date: new Date(eventDate), status: 'confirmed' }).lean();
    if (sameDate) return res.status(400).json({ error: 'Venue is not available on this date' });

    const GST_RATE = 0.18;
    const PLATFORM_FEE_RATE = 0.10;
    // Use the total amount passed in (venue price × total days), not just the daily price
    const baseAmount = Number(amount);
    const amountWithFee = baseAmount * (1 + PLATFORM_FEE_RATE);
    const payment_amount = Math.round(amountWithFee * (1 + GST_RATE));
    const payment_deadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Prepare dates_timings array with proper date/time conversion
    let storedDateTimings = [];
    if (datesTimings && Array.isArray(datesTimings) && datesTimings.length > 0) {
      storedDateTimings = processDatesTimings(datesTimings);
    } else if (eventTimeStart && eventTimeEnd) {
      // For single-day booking with event times
      const timeStartParts = eventTimeStart.split(':');
      const timeEndParts = eventTimeEnd.split(':');
      storedDateTimings = [{
        date: new Date(eventDate),
        datetime_from: createDateTime(eventDate, timeStartParts[0], timeStartParts[1], eventTimeStart.includes('PM') ? 'PM' : 'AM'),
        datetime_to: createDateTime(eventDate, timeEndParts[0], timeEndParts[1], eventTimeEnd.includes('PM') ? 'PM' : 'AM'),
        timing: {
          timeFromHour: timeStartParts[0] || '',
          timeFromMinute: timeStartParts[1] || '',
          timeFromPeriod: eventTimeStart.includes('PM') ? 'PM' : 'AM',
          timeToHour: timeEndParts[0] || '',
          timeToMinute: timeEndParts[1] || '',
          timeToPeriod: eventTimeEnd.includes('PM') ? 'PM' : 'AM'
        }
      }];
    }

    const doc = await Booking.create({
      venue_id: venueId,
      customer_id: customerId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      event_date: new Date(eventDate),
      event_type: eventType,
      guest_count: guestCount,
      event_time_start: eventTimeStart || null,
      event_time_end: eventTimeEnd || null,
      venue_name: venueName || venue.name || null,
      venue_location: venueLocation || venue.location || null,
      dates_timings: storedDateTimings,
      amount: amount,
      payment_amount,
      status: 'pending',
      payment_status: 'pending',
      payment_deadline: payment_deadline,
      special_requirements: specialRequirements
    });

    res.status(201).json({ message: 'Booking created successfully', bookingId: doc._id.toString(), paymentDeadline: payment_deadline });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking status (protected - venue owner only)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ownerId = req.user.id;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findById(id).lean();
    if (!booking) return res.status(404).json({ error: 'Booking not found or access denied' });

    const venue = await Venue.findById(booking.venue_id).lean();
    if (!venue || venue.owner_id.toString() !== ownerId) {
      return res.status(404).json({ error: 'Booking not found or access denied' });
    }

    const previousStatus = booking.status;
    let paymentStatus = 'not_required';
    if (status === 'confirmed') paymentStatus = 'pending';

    await Booking.updateOne({ _id: id }, { $set: { status, payment_status: paymentStatus } });

    if (status === 'confirmed') {
      await Venue.updateOne({ _id: booking.venue_id }, { $inc: { total_bookings: 1 } });
    }

    if (previousStatus === 'pending' && (status === 'confirmed' || status === 'cancelled')) {
      const owner = await User.findById(venue.owner_id, { name: 1, email: 1, mobile_number: 1 }).lean();

      const baseInquiryData = {
        venue: { id: venue._id.toString(), name: venue.name, location: venue.location, price: booking.amount },
        event: { date: booking.event_date, type: booking.event_type, guestCount: booking.guest_count, specialRequests: booking.special_requirements || 'None' },
        owner: { name: owner?.name || 'Venue Owner', email: owner?.email || 'Not provided', phone: owner?.mobile_number || 'Not provided' }
      };

      if (status === 'confirmed') {
        try {
          const adminInquiryData = { ...baseInquiryData, customer: { name: booking.customer_name, email: booking.customer_email, phone: booking.customer_phone } };
          await sendInquiryAcceptedToAdmin(adminInquiryData);
          const customerInquiryData = { ...baseInquiryData, customer: { name: booking.customer_name, email: booking.customer_email, phone: booking.customer_phone } };
          await sendInquiryAcceptedToCustomer(booking.customer_email, customerInquiryData);
        } catch (emailError) { console.error('Error sending inquiry acceptance emails:', emailError); }
      } else if (status === 'cancelled') {
        try {
          const adminInquiryData = { ...baseInquiryData, customer: { name: booking.customer_name, email: booking.customer_email, phone: booking.customer_phone } };
          await sendInquiryRejectedToAdmin(adminInquiryData);
          const customerInquiryData = { ...baseInquiryData, customer: { name: booking.customer_name, email: booking.customer_email, phone: booking.customer_phone } };
          await sendInquiryRejectedToCustomer(booking.customer_email, customerInquiryData);
        } catch (emailError) { console.error('Error sending inquiry rejection emails:', emailError); }
      }
    }

    res.json({ message: 'Booking status updated successfully', emailSent: previousStatus === 'pending' && (status === 'confirmed' || status === 'cancelled') });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Get recent bookings for dashboard (protected)
router.get('/owner/recent', authenticateToken, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { limit = 5 } = req.query;

    const venueIds = await Venue.find({ owner_id: ownerId }, { _id: 1 }).lean();
    const bookings = await Booking.find({ venue_id: { $in: venueIds.map(v => v._id) } })
      .populate('venue_id', 'name')
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .lean();

    const withVenue = bookings.map(b => ({
      ...b,
      venue_name: b.venue_id?.name,
      amount: Number(b.amount),
      payment_amount: Number(b.payment_amount || b.amount)
    }));

    res.json(withVenue);
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({ error: 'Failed to fetch recent bookings' });
  }
});

// Get inquiry count for notifications (protected)
router.get('/owner/inquiry-count', authenticateToken, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const venueIds = await Venue.find({ owner_id: ownerId }, { _id: 1 }).lean();
    const count = await Booking.countDocuments({ venue_id: { $in: venueIds.map(v => v._id) }, status: 'pending' });
    res.json({ inquiryCount: count, pendingBookings: count });
  } catch (error) {
    console.error('Error fetching inquiry count:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry count' });
  }
});

// Get all inquiries/pending bookings (protected)
router.get('/owner/inquiries', authenticateToken, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { limit = 20 } = req.query;
    const venueIds = await Venue.find({ owner_id: ownerId }, { _id: 1 }).lean();
    const inquiries = await Booking.find({ venue_id: { $in: venueIds.map(v => v._id) }, status: 'pending' })
      .populate('venue_id', 'name location')
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .lean();

    const mapped = inquiries.map(i => ({
      ...i,
      venue_name: i.venue_id?.name,
      venue_location: i.venue_id?.location,
      amount: Number(i.amount),
      payment_amount: Number(i.payment_amount || i.amount)
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// Send venue inquiry (protected)
router.post('/inquiry', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.id;
    const { venue_id, venue_name, user_details, event_date, event_time, dates_timings, venue_owner } = req.body;

    if (!venue_id || !venue_name || !user_details || !event_date) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const { fullName, email, phone, eventType, guestCount } = user_details;
    if (!fullName || !email || !phone || !eventType || !guestCount) {
      return res.status(400).json({ error: 'User details incomplete' });
    }

    const venue = await Venue.findById(venue_id).lean();
    if (!venue) return res.status(404).json({ error: 'Venue not found' });

    const estimatedAmount = venue.price_per_day || venue.price_min || 50000;
    const GST_RATE = 0.18;
    const basePrice = venue.price_per_day || venue.price_min || 50000;
    const payment_amount = Math.round(basePrice * (1 + GST_RATE));

    const eventTimeStart = event_time?.from || null;
    const eventTimeEnd = event_time?.to || null;

    // Prepare dates_timings array - either from multi-day booking or single day booking
    let storedDateTimings = [];
    if (dates_timings && Array.isArray(dates_timings) && dates_timings.length > 0) {
      storedDateTimings = processDatesTimings(dates_timings);
    } else if (event_time) {
      // For single-day booking with event_time, create dates_timings array
      const timeFromParts = event_time.from?.split(':') || [];
      const timeToParts = event_time.to?.split(':') || [];
      storedDateTimings = [{
        date: new Date(event_date),
        datetime_from: createDateTime(event_date, timeFromParts[0], timeFromParts[1], event_time.from?.includes('PM') ? 'PM' : 'AM'),
        datetime_to: createDateTime(event_date, timeToParts[0], timeToParts[1], event_time.to?.includes('PM') ? 'PM' : 'AM'),
        timing: {
          timeFromHour: timeFromParts[0] || '',
          timeFromMinute: timeFromParts[1] || '',
          timeFromPeriod: event_time.from?.includes('PM') ? 'PM' : 'AM',
          timeToHour: timeToParts[0] || '',
          timeToMinute: timeToParts[1] || '',
          timeToPeriod: event_time.to?.includes('PM') ? 'PM' : 'AM'
        }
      }];
    }

    try {
      await Booking.create({
        venue_id, customer_id: customerId,
        customer_name: fullName, customer_email: email, customer_phone: phone,
        event_date: new Date(event_date), event_type: eventType, guest_count: guestCount,
        event_time_start: eventTimeStart, event_time_end: eventTimeEnd,
        venue_name: venue_name, venue_location: venue.location || null,
        dates_timings: storedDateTimings,
        amount: estimatedAmount, payment_amount, special_requirements: user_details.specialRequests || null,
        status: 'pending'
      });
    } catch (dbError) {
      console.error('Error creating booking record:', dbError);
    }

    // Resolve owner details from DB to ensure reliability even if client omits them
    const dbOwner = await User.findById(venue.owner_id, { name: 1, email: 1, mobile_number: 1 }).lean();
    const ownerInfo = {
      name: dbOwner?.name || venue_owner?.name || 'Venue Owner',
      email: dbOwner?.email || venue_owner?.email || null,
      phone: dbOwner?.mobile_number || venue_owner?.phone || null
    };

    const baseInquiryData = {
      venue: { id: venue_id, name: venue_name, location: venue.location || 'Location not specified', price: venue.price_per_day || venue.price || 'Price not specified' },
      event: { type: eventType, date: event_date, guestCount, specialRequests: user_details.specialRequests || 'None' },
      owner: ownerInfo
    };

    try {
      if (ownerInfo.email) {
        const venueOwnerInquiryData = { ...baseInquiryData, customer: { name: fullName } };
        await sendVenueInquiryEmail(ownerInfo.email, venueOwnerInquiryData);
      }
      const adminInquiryData = { ...baseInquiryData, customer: { name: fullName, email, phone } };
      await sendInquiryNotificationToPlanzia(adminInquiryData);
    } catch (emailError) {
      console.error('Error sending inquiry emails:', emailError);
    }

    res.status(201).json({ message: 'Inquiry sent successfully! The venue owner and our team have been notified.', inquiryId: Date.now() });
  } catch (error) {
    console.error('Error processing venue inquiry:', error);
    res.status(500).json({ error: 'Failed to process inquiry' });
  }
});

// Get customer notifications for inquiry updates
router.get('/customer/notifications', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.id;
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const bookings = await Booking.find({ customer_id: customerId, updated_at: { $gt: since } })
      .populate('venue_id', 'name')
      .sort({ updated_at: -1 })
      .limit(10)
      .lean();

    const withMsg = bookings.map(b => {
      const venueName = b.venue_id?.name || b.venue_name || 'Your booked venue';
      const message = b.status === 'confirmed' ? `Your inquiry for ${venueName} has been accepted!` : b.status === 'cancelled' ? `Your inquiry for ${venueName} has been declined.` : `Your inquiry for ${venueName} is pending review.`;

      // Calculate payment amount if not stored
      let displayAmount = b.payment_amount;
      if (!displayAmount && b.amount) {
        const PLATFORM_FEE_RATE = 0.10;
        const GST_RATE = 0.18;
        const amountWithFee = b.amount * (1 + PLATFORM_FEE_RATE);
        displayAmount = Math.round(amountWithFee * (1 + GST_RATE));
      }

      return { id: b._id.toString(), venue_id: b.venue_id?._id?.toString() || b.venue_id.toString(), venue_name: venueName, event_date: b.event_date, guest_count: b.guest_count, amount: displayAmount || b.amount, status: b.status, updated_at: b.updated_at, notification_type: 'inquiry_status', message };
    });

    res.json(withMsg);
  } catch (error) {
    console.error('Error fetching customer notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get owner/venue notifications for inquiries
router.get('/owner/notifications', authenticateToken, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const venueIds = await Venue.find({ owner_id: ownerId }, { _id: 1 }).lean();
    const venueIdArray = venueIds.map(v => v._id);

    if (venueIdArray.length === 0) {
      return res.json([]);
    }

    const bookings = await Booking.find({ venue_id: { $in: venueIdArray }, updated_at: { $gt: since } })
      .sort({ updated_at: -1 })
      .limit(20)
      .lean();

    const withMsg = await Promise.all(bookings.map(async (b) => {
      let message = '';
      let notificationType = 'booking_inquiry';

      if (b.payment_status === 'completed' && b.status === 'confirmed') {
        const eventDate = new Date(b.event_date);
        const eventDay = eventDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        message = `✓ Payment Received! ${b.customer_name} has completed payment for ${b.guest_count} guests. Your settlement will be credited to your account within 2-3 business days after the event on ${eventDay}.`;
        notificationType = 'payment_completed';
      } else if (b.status === 'confirmed') {
        message = `✓ Booking Confirmed! ${b.customer_name} has confirmed a booking for ${b.guest_count} guests on ${new Date(b.event_date).toLocaleDateString('en-IN')}. Payment is pending.`;
        notificationType = 'booking_confirmed';
      } else if (b.status === 'cancelled') {
        message = `✗ Booking Cancelled. ${b.customer_name}'s inquiry for ${new Date(b.event_date).toLocaleDateString('en-IN')} (${b.guest_count} guests) has been declined.`;
        notificationType = 'booking_cancelled';
      } else {
        message = `◆ New Inquiry! ${b.customer_name} is interested in booking your venue for ${b.guest_count} guests on ${new Date(b.event_date).toLocaleDateString('en-IN')}. Please review and respond.`;
        notificationType = 'booking_inquiry';
      }

      return {
        id: b._id.toString(),
        venue_id: b.venue_id.toString(),
        venue_name: b.venue_name,
        event_date: b.event_date,
        guest_count: b.guest_count,
        amount: b.amount,
        payment_amount: b.payment_amount,
        payment_status: b.payment_status,
        status: b.status,
        updated_at: b.updated_at,
        payment_completed_at: b.payment_completed_at,
        customer_name: b.customer_name,
        customer_email: b.customer_email,
        notification_type: notificationType,
        message
      };
    }));

    res.json(withMsg);
  } catch (error) {
    console.error('Error fetching owner notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread notification count for customer
router.get('/customer/notification-count', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.id;
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const unread = await Booking.countDocuments({ customer_id: customerId, status: { $in: ['confirmed', 'cancelled'] }, updated_at: { $gt: since } });
    res.json({ unreadCount: unread });
  } catch (error) {
    console.error('Error fetching notification count:', error);
    res.status(500).json({ error: 'Failed to fetch notification count' });
  }
});

// Send payment reminder for a booking (protected)
router.post('/:id/send-payment-reminder', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    const booking = await Booking.findById(id).lean();
    if (!booking || booking.customer_id.toString() !== customerId) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'pending' || booking.payment_status !== 'pending') {
      return res.status(400).json({ error: 'Booking is not eligible for payment reminder' });
    }

    const result = await triggerPaymentReminderForBooking(id);
    res.json(result);
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    res.status(500).json({ error: 'Failed to send payment reminder' });
  }
});

// Get total revenue for venue owner (protected - venue owner only)
router.get('/owner/revenue', authenticateToken, async (req, res) => {
  try {
    const ownerId = req.user.id;

    const venueIds = await Venue.find({ owner_id: ownerId }, { _id: 1 }).lean();
    const venueIdArray = venueIds.map(v => v._id);

    const confirmedBookings = await Booking.find({
      venue_id: { $in: venueIdArray },
      status: 'confirmed',
      payment_status: 'completed'
    }).lean();

    const totalRevenue = confirmedBookings.reduce((sum, booking) => {
      return sum + (booking.payment_amount || booking.amount || 0);
    }, 0);

    const totalBookings = confirmedBookings.length;

    const basePrice = confirmedBookings.reduce((sum, booking) => {
      return sum + (booking.amount || 0);
    }, 0);

    const gstAmount = totalRevenue - basePrice;

    res.json({
      totalRevenue,
      basePrice,
      gstAmount,
      totalBookings,
      currency: 'INR'
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ error: 'Failed to fetch revenue' });
  }
});

// Get revenue by venue (protected - venue owner only)
router.get('/owner/revenue-by-venue', authenticateToken, async (req, res) => {
  try {
    const ownerId = req.user.id;

    const venues = await Venue.find({ owner_id: ownerId }, { _id: 1, name: 1, location: 1 }).lean();

    const revenueByVenue = await Promise.all(venues.map(async (venue) => {
      const bookings = await Booking.find({
        venue_id: venue._id,
        status: 'confirmed',
        payment_status: 'completed'
      }).lean();

      const totalRevenue = bookings.reduce((sum, booking) => {
        return sum + (booking.payment_amount || booking.amount || 0);
      }, 0);

      const basePrice = bookings.reduce((sum, booking) => {
        return sum + (booking.amount || 0);
      }, 0);

      return {
        venue_id: venue._id.toString(),
        venue_name: venue.name,
        venue_location: venue.location,
        totalRevenue,
        basePrice,
        gstAmount: totalRevenue - basePrice,
        totalBookings: bookings.length
      };
    }));

    res.json(revenueByVenue);
  } catch (error) {
    console.error('Error fetching revenue by venue:', error);
    res.status(500).json({ error: 'Failed to fetch revenue by venue' });
  }
});

// Get revenue summary with statistics (protected - venue owner only)
router.get('/owner/revenue-summary', authenticateToken, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { period = '30' } = req.query;
    const daysBack = parseInt(period) || 30;
    const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    const venueIds = await Venue.find({ owner_id: ownerId }, { _id: 1 }).lean();
    const venueIdArray = venueIds.map(v => v._id);

    const confirmedBookings = await Booking.find({
      venue_id: { $in: venueIdArray },
      status: 'confirmed',
      payment_status: 'completed',
      payment_completed_at: { $gte: startDate }
    }).lean();

    const pendingPayments = await Booking.find({
      venue_id: { $in: venueIdArray },
      status: 'pending',
      payment_status: 'pending',
      payment_deadline: { $gte: new Date() }
    }).lean();

    const totalRevenue = confirmedBookings.reduce((sum, booking) => {
      return sum + (booking.payment_amount || booking.amount || 0);
    }, 0);

    const pendingAmount = pendingPayments.reduce((sum, booking) => {
      return sum + (booking.payment_amount || booking.amount || 0);
    }, 0);

    const basePrice = confirmedBookings.reduce((sum, booking) => {
      return sum + (booking.amount || 0);
    }, 0);

    const gstAmount = totalRevenue - basePrice;

    const confirmedCount = confirmedBookings.length;
    const pendingCount = pendingPayments.length;

    const monthlyData = {};
    confirmedBookings.forEach((booking) => {
      const month = new Date(booking.payment_completed_at).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short'
      });
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += booking.payment_amount || booking.amount || 0;
    });

    res.json({
      summary: {
        totalRevenue,
        pendingAmount,
        basePrice,
        gstAmount,
        confirmedBookings: confirmedCount,
        pendingBookings: pendingCount,
        period: `${daysBack} days`,
        currency: 'INR'
      },
      monthlyData,
      recentBookings: confirmedBookings
        .sort((a, b) => new Date(b.payment_completed_at) - new Date(a.payment_completed_at))
        .slice(0, 10)
        .map(booking => ({
          _id: booking._id.toString(),
          venue_id: booking.venue_id.toString(),
          customer_name: booking.customer_name,
          event_date: booking.event_date,
          amount: booking.payment_amount || booking.amount,
          payment_completed_at: booking.payment_completed_at
        }))
    });
  } catch (error) {
    console.error('Error fetching revenue summary:', error);
    res.status(500).json({ error: 'Failed to fetch revenue summary' });
  }
});

export default router;
