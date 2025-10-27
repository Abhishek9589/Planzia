import React from 'react';
import { AlertCircle, Clock, DollarSign, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const transition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };
const slideDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function PaymentReminderBanner({
  urgentCount,
  totalPendingAmount,
  mostUrgentBooking,
  onNavigateToPayment,
  onDismiss,
  isDismissed
}) {
  if (
    isDismissed ||
    urgentCount === 0 ||
    !mostUrgentBooking ||
    totalPendingAmount === 0
  ) {
    return null;
  }

  const hoursRemaining = mostUrgentBooking.hoursRemaining || 0;
  const isExpired = hoursRemaining <= 0;
  const isCritical = hoursRemaining <= 2;

  return (
    <AnimatePresence>
      <motion.div
        variants={slideDown}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={transition}
        className={`w-full ${
          isExpired
            ? 'bg-gradient-to-r from-red-600 to-red-700'
            : isCritical
            ? 'bg-gradient-to-r from-orange-600 to-red-600'
            : 'bg-gradient-to-r from-amber-600 to-orange-600'
        } text-white shadow-lg`}
      >
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center gap-4 justify-between flex-wrap">
            {/* Icon & Message */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                {isExpired ? (
                  <AlertCircle className="h-6 w-6 animate-pulse" />
                ) : (
                  <Clock className="h-6 w-6 animate-pulse" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base">
                  {isExpired ? '⚠️ Payment Deadline Passed' : `⏰ ${hoursRemaining} Hour${hoursRemaining !== 1 ? 's' : ''} to Complete Payment`}
                </h3>
                <p className="text-xs sm:text-sm mt-1 opacity-90">
                  {mostUrgentBooking.venue_name || 'Your booking'} • 
                  {' '}
                  <span className="font-semibold flex items-center gap-1 inline">
                    <DollarSign className="h-3 w-3" />
                    ₹{totalPendingAmount.toLocaleString('en-IN')} pending
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={onNavigateToPayment}
                className="gap-2 bg-white hover:bg-gray-100 text-venue-dark"
              >
                Pay Now
                <ChevronRight className="h-4 w-4" />
              </Button>
              <button
                onClick={onDismiss}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-md transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {!isExpired && (
            <div className="mt-3 w-full bg-white bg-opacity-20 rounded-full h-1">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: '100%' }}
                animate={{
                  width: `${Math.max(0, Math.min(100, (hoursRemaining / 24) * 100))}%`
                }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
