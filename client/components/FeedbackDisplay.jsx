import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiClient from '../lib/apiClient';

export function FeedbackDisplay({ venueId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getJson(`/api/ratings/venue/${venueId}`);
        const ratingsWithFeedback = data.ratings.filter(r => r.feedback && r.feedback.trim());
        setFeedbacks(ratingsWithFeedback);
        setAverageRating(data.averageRating || 0);
        setTotalRatings(data.totalRatings || 0);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchFeedbacks();
    }
  }, [venueId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading feedback...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalRatings === 0 && feedbacks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Customer Feedback & Ratings
        </CardTitle>
        <div className="mt-4">
          {totalRatings > 0 ? (
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-600">({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No ratings yet. Be the first to rate this venue!</p>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {feedbacks.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No feedback yet</p>
            <p className="text-gray-500 text-sm">
              {totalRatings > 0
                ? 'Ratings have been submitted but no written feedback has been shared yet.'
                : 'Be the first to share your experience with this venue!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback, index) => (
              <div
                key={index}
                className="border-l-4 border-venue-indigo bg-gray-50 p-4 rounded-r-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {feedback.user_name || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < feedback.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {feedback.rating}/5
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(feedback.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {feedback.feedback}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
