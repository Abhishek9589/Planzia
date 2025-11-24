import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Calendar, Users, CreditCard, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import apiClient from '../lib/apiClient';

export default function VenueOwnerBookingDetailsModal({
  open,
  onOpenChange,
  booking,
  onPaymentClick,
  isProcessing,
  onStatusUpdate
}) {
  const [venueDetails, setVenueDetails] = useState(null);
  const [loading, setLoading] = useState(false);

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
  const pricePerDay = venueDetails?.price_per_day || booking.price_per_day || Math.round((booking.amount || 0) / numberOfDays);
  const totalAmount = pricePerDay * numberOfDays;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-gray-900">{booking.venue_name || 'Booking Details'}</DialogTitle>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Booking from <span className="font-semibold text-gray-900">{booking.customer_name || 'N/A'}</span>
              </p>
              {booking.venue_id && (
                <a
                  href={`/venue/${booking.venue_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Venue Details
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information Section */}
          <div className="border-b border-gray-200 pb-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Customer Name</p>
            <p className="text-base text-gray-900">{booking.customer_name || 'N/A'}</p>
          </div>

          {/* Venue Information Section */}
          {(booking.venue_name || booking.venue_location) && (
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-start justify-between gap-6">
                {booking.venue_name && (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Venue</p>
                    <p className="text-gray-900 font-semibold text-lg">{booking.venue_name}</p>
                  </div>
                )}
                {booking.venue_location && (
                  <div className="flex items-start gap-2 justify-end">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600 mb-1">Location</p>
                      <p className="text-gray-900 font-medium">{booking.venue_location}</p>
                    </div>
                    <MapPin className="h-5 w-5 text-gray-600 flex-shrink-0 mt-1" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Event Details Section */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600">Booked Date</p>
                  <p className="text-gray-900 mt-1 font-medium">
                    {new Date(booking.event_date).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {(booking.event_time_start || booking.event_time_end) && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Event Time</p>
                  <p className="text-gray-900 font-medium">
                    {booking.event_time_start}
                    {booking.event_time_end ? ` - ${booking.event_time_end}` : ''}
                  </p>
                </div>
              )}

              {booking.event_type && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Event Type</p>
                  <p className="text-gray-900 font-medium">{booking.event_type}</p>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Guest Count</p>
                  <p className="text-gray-900 mt-1 font-medium">{booking.guest_count || 0} guests</p>
                </div>
              </div>
            </div>
          </div>

          {/* All Event Dates and Timings Section - for multi-day bookings */}
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
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-semibold text-base">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-lg text-gray-900">₹{Number(totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(booking.status)}
                  <p className="text-xs font-medium text-gray-600 uppercase">Booking Status</p>
                </div>
                <p className={`text-sm font-semibold capitalize ${getStatusTextColor(booking.status)}`}>
                  {booking.status === 'confirmed' ? 'Confirmed' : booking.status}
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

          {/* Special Requirements */}
          {booking.special_requirements && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-600 mb-1">Special Requirements</p>
              <p className="text-gray-700 leading-relaxed text-sm">{booking.special_requirements}</p>
            </div>
          )}

          {/* Booking Date */}
          <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">
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
          {booking.status === 'pending' && onStatusUpdate && (
            <>
              <Button
                onClick={() => {
                  onStatusUpdate(booking._id || booking.id, 'confirmed');
                  onOpenChange(false);
                }}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white order-2 sm:order-1"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Inquiry
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  onStatusUpdate(booking._id || booking.id, 'cancelled');
                  onOpenChange(false);
                }}
                disabled={isProcessing}
                variant="destructive"
                className="order-1 sm:order-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Decline Inquiry'
                )}
              </Button>
            </>
          )}
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-amber-700 hover:bg-amber-800 text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
