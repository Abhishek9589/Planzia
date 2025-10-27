import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Rating from '../models/Rating.js';
import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = Router();

// Get ratings for a venue (public)
router.get('/venue/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(venueId)) {
      return res.status(400).json({ error: 'Invalid venue ID' });
    }

    const ratings = await Rating.find({ venue_id: venueId })
      .sort({ created_at: -1 })
      .lean();

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
      : 0;

    res.json({
      averageRating: parseFloat(averageRating),
      totalRatings,
      ratings: ratings.map(r => ({
        id: r._id.toString(),
        rating: r.rating,
        feedback: r.feedback,
        user_name: r.user_name || 'Anonymous',
        created_at: r.created_at
      }))
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

    const canRate = today > eventDate;
    const nextDay = new Date(eventDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingRating = await Rating.findOne({
      booking_id: bookingId,
      user_id: userId
    }).lean();

    res.json({
      canRate,
      hasRated: !!existingRating,
      eventDate: booking.event_date,
      nextRatingDate: nextDay,
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

    const allRatings = await Rating.find({ venue_id: venueId }).lean();
    const averageRating = allRatings.length > 0
      ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1)
      : 0;

    await Venue.updateOne(
      { _id: venueId },
      { rating: parseFloat(averageRating) }
    );

    res.status(201).json({
      message: 'Rating submitted successfully',
      ratingId: savedRating._id.toString(),
      averageRating: parseFloat(averageRating),
      totalRatings: allRatings.length
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
