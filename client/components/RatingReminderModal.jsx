import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const transition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };

export default function RatingReminderModal({ 
  isOpen, 
  booking, 
  onClose, 
  onRatingClick 
}) {
  const [hoverRating, setHoverRating] = useState(0);

  if (!booking) {
    return null;
  }

  const handleRating = (rating) => {
    if (onRatingClick) {
      onRatingClick(rating, booking);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            Rate Your Experience
          </DialogTitle>
          <DialogDescription>
            Help us improve and assist other event planners
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6 py-4">
          {/* Venue Info */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-venue-dark mb-1">
              {booking.venue_name || 'Your Venue'}
            </h3>
            <p className="text-sm text-gray-600">
              Event held on {new Date(booking.event_date).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              We'd love to hear about your experience! Your honest feedback helps other customers find great venues and helps us improve our service.
            </p>
            <p className="text-xs text-gray-600 italic">
              "Rating your venue helps others and is a little important for us 😊"
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-3 py-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <motion.button
                key={rating}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRating(rating)}
                onMouseEnter={() => setHoverRating(rating)}
                onMouseLeave={() => setHoverRating(0)}
                className={`focus:outline-none transition-all ${
                  rating <= (hoverRating || 0)
                    ? 'text-yellow-400 scale-110'
                    : 'text-gray-300'
                }`}
              >
                <Star
                  className="h-10 w-10 fill-current"
                  strokeWidth={1.5}
                />
              </motion.button>
            ))}
          </div>

          {/* Rating Labels */}
          <div className="text-center">
            {hoverRating > 0 && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold text-venue-purple"
              >
                {hoverRating === 1 && "Poor experience 😞"}
                {hoverRating === 2 && "Below expectations 😕"}
                {hoverRating === 3 && "Good experience 😊"}
                {hoverRating === 4 && "Great experience 😄"}
                {hoverRating === 5 && "Excellent! 🎉"}
              </motion.p>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex gap-2 sm:flex-row flex-col-reverse">
          <Button
            variant="outline"
            onClick={onClose}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Maybe Later
          </Button>
          <p className="text-xs text-gray-500 text-center sm:text-left col-span-2">
            You can always rate this venue later from your dashboard
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
