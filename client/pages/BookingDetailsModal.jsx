import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Calendar, Users, CreditCard, ExternalLink, CheckCircle, Clock } from 'lucide-react';

export default function BookingDetailsModal({
  open,
  onOpenChange,
  booking,
  onPaymentClick,
  isProcessing
}) {
  if (!booking) return null;

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-amber-50 border-amber-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'confirmed') return <CheckCircle className="h-4 w-4 text-green-700" />;
    if (status === 'pending') return <Clock className="h-4 w-4 text-amber-700" />;
    return null;
  };

  const getPaymentStatusColor = (status) => {
    return status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200';
  };

  const getPaymentStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="h-4 w-4 text-green-700" />;
    return <Clock className="h-4 w-4 text-amber-700" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-2xl font-bold text-gray-900">{booking.venue_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Venue Location Section */}
          <div className="border-b border-gray-200 pb-4">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="text-gray-900 mt-0.5">{booking.venue_location}</p>
                </div>
              </div>
              <div className="flex gap-2 ml-8">
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(booking.venue_location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  View on Map
                  <ExternalLink className="h-3 w-3" />
                </a>
                {booking.venue_id && (
                  <a
                    href={`/venue/${booking.venue_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Venue Details
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="border-b border-gray-200 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600">Event Date</p>
                  <p className="text-gray-900 mt-1">
                    {new Date(booking.event_date).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Event Type</p>
                <p className="text-gray-900">{booking.event_type}</p>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Guest Count</p>
                  <p className="text-gray-900 mt-1">{booking.guest_count} guests</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Status Section */}
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-600 uppercase mb-2">Amount</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">₹</span>
                <p className="text-3xl font-bold text-gray-900">
                  {Number(booking.amount || booking.payment_amount || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={`rounded-lg border p-4 ${getBookingStatusColor(booking.status)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(booking.status)}
                  <p className="text-xs font-medium text-gray-600 uppercase">Booking Status</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {booking.status === 'confirmed' ? 'Confirmed' : booking.status}
                </p>
              </div>

              <div className={`rounded-lg border p-4 ${getPaymentStatusColor(booking.payment_status)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getPaymentStatusIcon(booking.payment_status)}
                  <p className="text-xs font-medium text-gray-600 uppercase">Payment Status</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {booking.payment_status === 'completed' ? 'Paid' : 'Pending'}
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
            Booked on {new Date(booking.created_at).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        <DialogFooter className="gap-2 mt-4 sm:gap-2 flex-col sm:flex-row">
          {booking.payment_status !== 'completed' && booking.status === 'confirmed' && (
            <Button
              onClick={() => {
                onPaymentClick(booking._id, booking.payment_amount || booking.amount, booking.venue_name);
                onOpenChange(false);
              }}
              disabled={isProcessing}
              className="bg-venue-indigo hover:bg-venue-indigo/90 text-white transition-all order-2 sm:order-1"
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
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="order-1 sm:order-2"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
