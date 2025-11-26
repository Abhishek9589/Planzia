import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Calendar, Users, CreditCard, ExternalLink, CheckCircle, Clock, Trash2 } from 'lucide-react';
import apiClient from '../lib/apiClient';
import CancelBookingDialog from './CancelBookingDialog';

export default function CustomerBookingDetailsModal({
  open,
  onOpenChange,
  booking,
  onPaymentClick,
  isProcessing,
  onBookingCancelled
}) {
  const [venueDetails, setVenueDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (open && booking?.venue_id) {
      fetchVenueDetails();
    }
  }, [open, booking?.venue_id]);

  const fetchVenueDetails = async () => {
    try {
      setLoading(true);
      const venueId = typeof booking.venue_id === 'object' ? booking.venue_id?._id || booking.venue_id?.id : booking.venue_id;
      if (!venueId) {
        console.warn('Invalid venue ID:', booking.venue_id);
        return;
      }
      const response = await apiClient.getJson(`/api/venues/${venueId}`);
      setVenueDetails(response);
    } catch (error) {
      console.error('Error fetching venue details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-700';
      case 'pending':
        return 'text-gray-700';
      case 'cancelled':
      case 'rejected':
        return 'text-gray-700';
      default:
        return 'text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'confirmed') return <CheckCircle className="h-4 w-4 text-green-700" />;
    if (status === 'pending') return <Clock className="h-4 w-4 text-gray-700" />;
    return null;
  };

  const getPaymentStatusTextColor = (status) => {
    return status === 'completed' ? 'text-green-700' : 'text-gray-700';
  };

  const getPaymentStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="h-4 w-4 text-green-700" />;
    return <Clock className="h-4 w-4 text-gray-700" />;
  };

  const calculateNumberOfDays = () => {
    if (booking.dates_timings && Array.isArray(booking.dates_timings) && booking.dates_timings.length > 0) {
      return booking.dates_timings.length;
    }
    if (booking.number_of_days) {
      return booking.number_of_days;
    }
    return 1;
  };

  if (!booking) return null;

  const numberOfDays = calculateNumberOfDays();
  const pricePerDay = venueDetails?.price_per_day || booking.price_per_day || 0;

  const venueAmount = pricePerDay * numberOfDays;
  const platformFeePercentage = 0.10;
  const gstPercentage = 0.18;
  const platformFee = venueAmount * platformFeePercentage;
  const gstFee = (venueAmount + platformFee) * gstPercentage;
  const totalAmount = venueAmount + platformFee + gstFee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-gray-900">Your Booking Details</DialogTitle>
            <p className="text-sm text-gray-600">Complete information about your venue booking</p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information Section */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase mb-1">Full Name</p>
                <p className="text-base font-medium text-gray-900">{booking.customer_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase mb-1">Email</p>
                <p className="text-base font-medium text-gray-900">{booking.customer_email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase mb-1">Phone Number</p>
                <p className="text-base font-medium text-gray-900">{booking.customer_phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Venue Information Section */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Venue Information</h3>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 uppercase mb-1">Venue Name</p>
                  <p className="text-base font-semibold text-gray-900">{booking.venue_name || 'N/A'}</p>
                </div>
                {booking.venue_id && (
                  <a
                    href={`/venue/${booking.venue_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
                  >
                    Venue Details
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              {booking.venue_location && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 uppercase mb-1">Location</p>
                    <p className="text-base font-medium text-gray-900">{booking.venue_location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Details Section */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase mb-1">Event Type</p>
                <p className="text-base font-medium text-gray-900">{booking.event_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase mb-1">Event Date</p>
                <p className="text-base font-medium text-gray-900">
                  {booking.event_date
                    ? new Date(booking.event_date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Guest Count</p>
                  <p className="text-base font-medium text-gray-900">{booking.guest_count || 0} guests</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase mb-1">Number of Days</p>
                <p className="text-base font-medium text-gray-900">{numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}</p>
              </div>
            </div>
            {(booking.event_time_start || booking.event_time_end) && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-600 uppercase mb-1">Event Time</p>
                <p className="text-base font-medium text-gray-900">
                  {booking.event_time_start}
                  {booking.event_time_end ? ` - ${booking.event_time_end}` : ''}
                </p>
              </div>
            )}
          </div>

          {/* Event Schedule Section - for multi-day bookings */}
          {booking.dates_timings && booking.dates_timings.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Event Schedule</h3>
              <div className="space-y-2">
                {booking.dates_timings.map((dateiming, idx) => {
                  const timing = dateiming.timing || {};
                  const timeFromStr = timing.timeFromHour && timing.timeFromMinute
                    ? `${timing.timeFromHour}:${String(timing.timeFromMinute).padStart(2, '0')} ${timing.timeFromPeriod || 'AM'}`
                    : 'N/A';
                  const timeToStr = timing.timeToHour && timing.timeToMinute
                    ? `${timing.timeToHour}:${String(timing.timeToMinute).padStart(2, '0')} ${timing.timeToPeriod || 'AM'}`
                    : 'N/A';

                  let dateStr = 'N/A';
                  try {
                    const dateObj = new Date(dateiming.date);
                    dateStr = dateObj.toLocaleDateString('en-IN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                  } catch (error) {
                    console.error('Error formatting date:', error);
                  }

                  return (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-3 flex-1">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{timeFromStr} - {timeToStr}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Payment Breakdown Section */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Payment Breakdown</h3>
            <div className="space-y-2 text-sm bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price per day:</span>
                <span className="font-medium text-gray-900">₹{Number(pricePerDay).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total days booked:</span>
                <span className="font-medium text-gray-900">{numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-gray-600">Venue Amount:</span>
                <span className="font-medium text-gray-900">₹{Number(venueAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Platform Fee (10%):</span>
                <span className="font-medium text-gray-900">₹{Number(platformFee).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">GST (18%):</span>
                <span className="font-medium text-gray-900">₹{Number(gstFee).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-semibold text-base">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-lg text-gray-900">₹{Number(totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(booking.status)}
                  <p className="text-xs font-medium text-gray-600 uppercase">Booking Status</p>
                </div>
                <p className={`text-sm font-semibold capitalize ${getStatusTextColor(booking.status)}`}>
                  {booking.status === 'confirmed' ? 'Confirmed' : booking.status === 'cancelled' ? 'Cancelled' : booking.status}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getPaymentStatusIcon(booking.payment_status)}
                  <p className="text-xs font-medium text-gray-600 uppercase">Payment Status</p>
                </div>
                <p className={`text-sm font-semibold ${getPaymentStatusTextColor(booking.payment_status)}`}>
                  {booking.payment_status === 'completed' ? 'Paid' : booking.payment_status === 'pending' ? 'Pending' : booking.payment_status}
                </p>
              </div>
            </div>
          </div>

          {/* Refund Information - shown when booking is paid */}
          {booking.payment_status === 'completed' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">Refund Policy</h3>
              <p className="text-sm text-amber-800 mb-3">
                If you wish to cancel this paid booking, a refund can be processed. However, please note that a small deduction such as GST will be applied from the refunded amount.
              </p>
              <p className="text-xs text-amber-700">
                For refund assistance, please contact our customer care team at support@planzia.com or call us for immediate support.
              </p>
            </div>
          )}

          {/* Special Requirements */}
          {booking.special_requirements && (
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Special Requirements</p>
              <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 rounded-lg p-3">{booking.special_requirements}</p>
            </div>
          )}

          {/* Booking Creation Date */}
          <div className="text-xs text-gray-500">
            Booked on {new Date(booking.created_at || booking.booking_date).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        <DialogFooter className="gap-2 mt-6 sm:gap-2 flex-col sm:flex-row">
          {booking.payment_status !== 'completed' && booking.status === 'confirmed' && (
            <Button
              onClick={() => {
                onPaymentClick(booking._id, booking.payment_amount || booking.amount, booking.venue_name);
                onOpenChange(false);
              }}
              disabled={isProcessing}
              className="bg-venue-indigo hover:bg-venue-indigo/90 text-white transition-all order-3 sm:order-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </>
              )}
            </Button>
          )}
          {booking.status !== 'cancelled' && (
            <Button
              onClick={() => setShowCancelDialog(true)}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white order-2 sm:order-2"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          )}
          <Button
            onClick={() => onOpenChange(false)}
            className="order-1 sm:order-3 bg-gray-600 hover:bg-gray-700 text-white border-0"
          >
            Close
          </Button>
        </DialogFooter>

        {/* Cancel Booking Dialog */}
        <CancelBookingDialog
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
          booking={booking}
          onCancelSuccess={() => {
            if (onBookingCancelled) {
              onBookingCancelled();
            }
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
