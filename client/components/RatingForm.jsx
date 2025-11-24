import React, { useState, useEffect } from 'react';
import { Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RatingFormLoadingDialog } from './RatingFormLoadingDialog';
import { RatingFormErrorDialog } from './RatingFormErrorDialog';
import { RatingFormNotAvailableDialog } from './RatingFormNotAvailableDialog';
import apiClient from '../lib/apiClient';

export function RatingForm({ bookingId, venueId, venueName, isOpen, onClose, onRatingSubmitted }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [ratingStatus, setRatingStatus] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const checkRatingEligibility = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getJson(`/api/ratings/check/${bookingId}`);
        setRatingStatus(data);

        if (data.existingRating) {
          setRating(data.existingRating.rating);
          setFeedback(data.existingRating.feedback);
        }
      } catch (err) {
        console.error('Error checking rating eligibility:', err);
        setError('Failed to check rating eligibility');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && bookingId) {
      checkRatingEligibility();
    }
  }, [isOpen, bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await apiClient.postJson('/api/ratings', {
        venueId,
        bookingId,
        rating,
        feedback,
        userName
      });

      setSuccess(true);
      setRating(0);
      setFeedback('');
      setUserName('');

      setTimeout(() => {
        setSuccess(false);
        onRatingSubmitted?.();
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <RatingFormLoadingDialog isOpen={isOpen} onClose={onClose} />;
  }

  if (!ratingStatus) {
    return <RatingFormErrorDialog isOpen={isOpen} onClose={onClose} error={error} />;
  }

  if (!ratingStatus.canRate) {
    return (
      <RatingFormNotAvailableDialog
        isOpen={isOpen}
        onClose={onClose}
        eventDate={ratingStatus.eventDate}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ratingStatus.hasRated ? 'Update Your Rating' : 'Rate This Venue'}
          </DialogTitle>
          <DialogDescription>
            {venueName}
          </DialogDescription>
        </DialogHeader>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <div className="text-green-600 font-semibold">✓</div>
            <div>
              <p className="font-semibold text-green-900">Thank you!</p>
              <p className="text-sm text-green-700">Your rating has been submitted successfully.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Your Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      value <= (hoverRating || rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                You rated this venue {rating} out of 5 stars
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="userName" className="block text-sm font-semibold text-gray-700">
              Your Name (Optional)
            </label>
            <Input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name or leave empty for anonymous"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700">
              Feedback (Optional)
            </label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience at this venue..."
              rows={4}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Maximum 500 characters
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!rating || submitting}
              className="bg-venue-indigo hover:bg-venue-purple text-white"
            >
              {submitting ? 'Submitting...' : (ratingStatus.hasRated ? 'Update Rating' : 'Submit Rating')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
