import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Rating from '../models/Rating.js';
import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = Router();

// Get ratings for a venue (public) - with pagination
router.get('/venue/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(venueId)) {
      return res.status(400).json({ error: 'Invalid venue ID' });
    }

    const limitInt = Math.min(parseInt(limit) || 10, 50);
    const pageInt = Math.max(parseInt(page) || 1, 1);
    const skipInt = (pageInt - 1) * limitInt;

    const venueId_obj = new mongoose.Types.ObjectId(venueId);

    const aggregation = await Rating.aggregate([
      { $match: { venue_id: venueId_obj } },
      {
        $facet: {
          stats: [
            {
              $group: {
                _id: null,
                average: { $avg: '$rating' },
                total: { $sum: 1 }
              }
            }
          ],
          ratings: [
            { $sort: { created_at: -1 } },
            { $skip: skipInt },
            { $limit: limitInt },
            {
              $project: {
                id: { $toString: '$_id' },
                rating: 1,
                feedback: 1,
                user_name: { $ifNull: ['$user_name', 'Anonymous'] },
                created_at: 1
              }
            }
          ]
        }
      }
    ]);

    const stats = aggregation[0]?.stats[0] || { average: 0, total: 0 };
    const ratings = aggregation[0]?.ratings || [];

    res.json({
      averageRating: parseFloat((stats.average || 0).toFixed(1)),
      totalRatings: stats.total,
      currentPage: pageInt,
      totalPages: Math.ceil(stats.total / limitInt),
      ratings
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Check if user can rate and if they already have rated
router.get('/check/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.customer_id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const eventDate = new Date(booking.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    const eventDatePassed = today > eventDate;
    const paymentCompleted = booking.payment_status === 'completed';
    const canRate = eventDatePassed && paymentCompleted;
    const nextDay = new Date(eventDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingRating = await Rating.findOne({
      booking_id: bookingId,
      user_id: userId
    }).lean();

    let paymentReason = null;
    if (!paymentCompleted) {
      if (booking.payment_status === 'pending') {
        paymentReason = 'Payment is still pending. Please complete the payment to rate this venue.';
      } else if (booking.payment_status === 'failed') {
        paymentReason = 'Payment failed. Please complete the payment to rate this venue.';
      } else if (booking.payment_status === 'not_required') {
        paymentReason = 'This booking does not require payment. You may be ineligible to rate.';
      } else {
        paymentReason = `Payment status is ${booking.payment_status}. Complete payment to rate.`;
      }
    }

    res.json({
      canRate,
      hasRated: !!existingRating,
      eventDate: booking.event_date,
      nextRatingDate: nextDay,
      eventDatePassed,
      paymentCompleted,
      paymentStatus: booking.payment_status,
      paymentReason,
      existingRating: existingRating ? {
        id: existingRating._id.toString(),
        rating: existingRating.rating,
        feedback: existingRating.feedback
      } : null
    });
  } catch (error) {
    console.error('Error checking rating eligibility:', error);
    res.status(500).json({ error: 'Failed to check rating eligibility' });
  }
});

// Submit or update a rating (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { venueId, bookingId, rating, feedback, userName } = req.body;

    if (!venueId || !bookingId || !rating) {
      return res.status(400).json({ error: 'Required fields: venueId, bookingId, rating' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.customer_id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (booking.payment_status !== 'completed') {
      return res.status(403).json({ error: 'Payment must be completed before rating this venue' });
    }

    const eventDate = new Date(booking.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (today <= eventDate) {
      return res.status(400).json({ error: 'You can only rate after your event date' });
    }

    const existingRating = await Rating.findOne({
      booking_id: bookingId,
      user_id: userId
    });

    let savedRating;
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.feedback = feedback || '';
      existingRating.user_name = userName || '';
      await existingRating.save();
      savedRating = existingRating;
    } else {
      const newRating = await Rating.create({
        venue_id: venueId,
        user_id: userId,
        booking_id: bookingId,
        rating,
        feedback: feedback || '',
        user_name: userName || ''
      });
      savedRating = newRating;
    }

    const venueId_obj = new mongoose.Types.ObjectId(venueId);
    const stats = await Rating.aggregate([
      { $match: { venue_id: venueId_obj } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          total: { $sum: 1 }
        }
      }
    ]);

    const ratingStats = stats[0] || { average: 0, total: 0 };
    const averageRating = parseFloat((ratingStats.average || 0).toFixed(1));

    await Venue.updateOne(
      { _id: venueId },
      { rating: averageRating }
    );

    res.status(201).json({
      message: 'Rating submitted successfully',
      ratingId: savedRating._id.toString(),
      averageRating,
      totalRatings: ratingStats.total
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Get customer's rating for a booking (protected)
router.get('/booking/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.customer_id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const rating = await Rating.findOne({
      booking_id: bookingId,
      user_id: userId
    }).lean();

    res.json({
      hasRating: !!rating,
      rating: rating ? {
        id: rating._id.toString(),
        rating: rating.rating,
        feedback: rating.feedback,
        created_at: rating.created_at
      } : null
    });
  } catch (error) {
    console.error('Error fetching booking rating:', error);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
});

export default router;
