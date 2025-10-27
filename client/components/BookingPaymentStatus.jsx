import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, CheckCircle, X, Bell, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import apiClient from '../lib/apiClient';

const transition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };
const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export default function BookingPaymentStatus({ booking, onPaymentReminderSent }) {
  const [sendingReminder, setSendingReminder] = useState(false);

  const getPaymentStatusDetails = () => {
    if (booking.status === 'confirmed' && booking.payment_status === 'completed') {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        label: 'Payment Confirmed',
        description: 'Your payment has been successfully processed'
      };
    }

    if (booking.status === 'pending' && booking.payment_status === 'pending') {
      const deadline = new Date(booking.payment_deadline);
      const now = new Date();
      const hoursRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60));
      const isExpiring = hoursRemaining <= 3;

      return {
        icon: Clock,
        color: isExpiring ? 'text-red-600' : 'text-orange-600',
        bgColor: isExpiring ? 'bg-red-50' : 'bg-orange-50',
        borderColor: isExpiring ? 'border-red-200' : 'border-orange-200',
        label: 'Payment Required',
        description: hoursRemaining > 0 
          ? `Payment due in ${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''}`
          : 'Payment deadline has passed',
        hoursRemaining,
        isExpiring,
        deadline
      };
    }

    if (booking.status === 'cancelled') {
      return {
        icon: X,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        label: 'Booking Cancelled',
        description: booking.cancellation_reason || 'This booking has been cancelled',
        cancelled: true
      };
    }

    return {
      icon: AlertCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      label: 'Pending',
      description: 'Processing your booking request'
    };
  };

  const sendPaymentReminder = async () => {
    try {
      setSendingReminder(true);
      await apiClient.postJson(`/api/bookings/${booking._id || booking.id}/send-payment-reminder`, {});
      
      toast({
        title: 'Reminder Sent',
        description: 'Payment reminder has been sent to your email',
        variant: 'default'
      });

      if (onPaymentReminderSent) {
        onPaymentReminderSent();
      }
    } catch (error) {
      console.error('Error sending payment reminder:', error);
      toast({
        title: 'Error',
        description: 'Failed to send payment reminder. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSendingReminder(false);
    }
  };

  const details = getPaymentStatusDetails();
  const IconComponent = details.icon;

  return (
    <motion.div
      className={`border rounded-lg p-4 ${details.bgColor} ${details.borderColor}`}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={transition}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 mt-0.5`}>
          <IconComponent className={`h-5 w-5 ${details.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h4 className={`font-semibold ${details.color}`}>
                {details.label}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {details.description}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0">
              {details.isExpiring && (
                <Badge variant="destructive" className="animate-pulse">
                  Urgent
                </Badge>
              )}
              {!details.isExpiring && booking.payment_status === 'completed' && (
                <Badge className="bg-green-600">
                  ✓ Verified
                </Badge>
              )}
            </div>
          </div>

          {/* Additional Info */}
          {details.deadline && (
            <div className="mt-3 pt-3 border-t border-current border-opacity-10">
              <p className="text-xs text-gray-600">
                <strong>Payment Deadline:</strong> {new Date(details.deadline).toLocaleString('en-IN')}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {booking.status === 'pending' && booking.payment_status === 'pending' && details.hoursRemaining > 0 && (
            <div className="mt-4 flex gap-3 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={sendPaymentReminder}
                disabled={sendingReminder}
                className="gap-2"
              >
                {sendingReminder ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    Send Reminder
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Warning for expired booking */}
          {booking.status === 'pending' && booking.payment_status === 'pending' && details.hoursRemaining <= 0 && (
            <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-md">
              <p className="text-xs text-red-700">
                <strong>⚠️ Your booking will be automatically cancelled</strong> if payment is not completed. 
                {' '}
                <a href="/user-dashboard" className="underline font-semibold">
                  Complete payment now
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
