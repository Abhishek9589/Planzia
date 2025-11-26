import { useState } from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import apiClient from '../lib/apiClient';
import { toast } from '@/components/ui/use-toast';

export default function CancelBookingDialog({
  open,
  onOpenChange,
  booking,
  onCancelSuccess
}) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setLoading(true);
      await apiClient.postJson(`/api/bookings/${booking._id || booking.id}/cancel`, {}, { skipErrorDispatch: true });

      if (isPaid) {
        toast({
          title: 'Booking Cancelled',
          description: 'Your booking has been cancelled. Please contact support at support@planzia.com for refund processing.'
        });
      } else {
        toast({
          title: 'Booking Cancelled',
          description: 'Your booking has been cancelled successfully'
        });
      }

      onOpenChange(false);
      if (onCancelSuccess) {
        onCancelSuccess();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);

      const errorMessage = error?.message || error?.toString() || 'Failed to cancel booking. Please try again.';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  const isPaid = booking.payment_status === 'completed';
  const isPending = booking.status === 'pending';
  const isConfirmed = booking.status === 'confirmed';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-lg">Cancel Booking</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Are you sure you want to cancel this booking?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Venue:</span>
              <span className="font-medium text-gray-900">{booking.venue_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Event Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(booking.event_date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Guest Count:</span>
              <span className="font-medium text-gray-900">{booking.guest_count} guests</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-gray-900">₹{Number(booking.payment_amount || booking.amount).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Status Information */}
          <div className="space-y-2">
            {isPending && !isPaid && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Inquiry Pending</p>
                  <p className="text-blue-800 text-xs mt-1">You can cancel this inquiry anytime. The venue owner will be notified of your cancellation.</p>
                </div>
              </div>
            )}

            {isConfirmed && !isPaid && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-3">
                <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-900">Booking Confirmed</p>
                  <p className="text-green-800 text-xs mt-1">Payment is still pending. You can cancel anytime, and your booking slot will be freed up.</p>
                </div>
              </div>
            )}

            {isPaid && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900">Payment Completed</p>
                  <p className="text-amber-800 text-xs mt-1">You can cancel this booking. Please note: a small deduction such as GST will be applied from the refunded amount. Contact support@planzia.com for refund processing.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            disabled={loading}
            className="border-gray-300"
          >
            Keep Booking
          </Button>
          <Button
            onClick={handleCancel}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Cancelling...
              </>
            ) : (
              'Yes, Cancel Booking'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
