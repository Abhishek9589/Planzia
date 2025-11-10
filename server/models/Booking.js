import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  venue_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  customer_phone: { type: String },
  event_date: { type: Date, required: true },
  event_time_start: { type: String },
  event_time_end: { type: String },
  event_type: { type: String },
  guest_count: { type: Number, required: true },
  venue_name: { type: String },
  venue_location: { type: String },
  dates_timings: [{
    date: { type: Date },
    datetime_from: { type: Date },
    datetime_to: { type: Date },
    timing: {
      timeFromHour: String,
      timeFromMinute: String,
      timeFromPeriod: String,
      timeToHour: String,
      timeToMinute: String,
      timeToPeriod: String
    }
  }],
  amount: { type: Number, required: true },
  payment_amount: { type: Number },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  cancellation_reason: { type: String },
  payment_status: { type: String, enum: ['not_required', 'pending', 'completed', 'failed'], default: 'pending' },
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  payment_initiated_at: { type: Date },
  payment_deadline: { type: Date },
  payment_completed_at: { type: Date },
  payment_error_description: { type: String },
  special_requirements: { type: String },
  booking_date: { type: Date, default: Date.now },
  last_payment_reminder_sent_at: { type: Date },
  payment_reminder_count: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

BookingSchema.index({ payment_deadline: 1, status: 1 });
BookingSchema.index({ status: 1, payment_status: 1, last_payment_reminder_sent_at: 1 });

BookingSchema.virtual('id').get(function () { return this._id.toString(); });
BookingSchema.set('toJSON', { virtuals: true });
BookingSchema.set('toObject', { virtuals: true });

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export default Booking;
