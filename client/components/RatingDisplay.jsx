import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import apiClient from '../lib/apiClient';

export function RatingDisplay({ venueId }) {
  const [rating, setRating] = useState(null);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getJson(`/api/ratings/venue/${venueId}`);
        setRating(parseFloat(data.averageRating) || 0);
        setTotalRatings(data.totalRatings || 0);
      } catch (error) {
        console.error('Error fetching ratings:', error);
        setRating(0);
        setTotalRatings(0);
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchRatings();
    }
  }, [venueId]);

  if (loading) {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 text-gray-300" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  const displayRating = rating !== null ? rating : 0.0;
  const displayCount = totalRatings || 0;

  return (
    <div className="flex items-center gap-2">
      {displayRating > 0 ? (
        <>
          <div className="flex items-center text-venue-indigo">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(displayRating) ? 'fill-venue-indigo' : 'fill-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({displayRating.toFixed(1)})</span>
        </>
      ) : (
        <span className="text-sm text-gray-500">No ratings yet</span>
      )}
    </div>
  );
}
