import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  venue_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String, default: '' },
  user_name: { type: String, default: '' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

RatingSchema.index({ venue_id: 1, user_id: 1, booking_id: 1 }, { unique: true });
RatingSchema.index({ venue_id: 1 });
RatingSchema.index({ user_id: 1 });
RatingSchema.index({ booking_id: 1 });

RatingSchema.virtual('id').get(function () { return this._id.toString(); });
RatingSchema.set('toJSON', { virtuals: true });
RatingSchema.set('toObject', { virtuals: true });

const Rating = mongoose.models.Rating || mongoose.model('Rating', RatingSchema);
export default Rating;
