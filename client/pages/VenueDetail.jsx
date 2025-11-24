import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { scrollToTop } from '@/lib/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Notification } from '@/components/ui/notification';
import { FloatingMessage } from '@/components/ui/floating-message';
import { toast } from '@/components/ui/use-toast';
import { RatingDisplay } from '@/components/RatingDisplay';
import { RatingForm } from '@/components/RatingForm';
import { FeedbackDisplay } from '@/components/FeedbackDisplay';
import MultiDayBookingModal from '@/components/MultiDayBookingModal';
import { useFavorites } from '../hooks/useFavorites';
import { getUserFriendlyError } from '../lib/errorMessages';
import { getPriceBreakdownComponent } from '../lib/priceUtils';
import {
  MapPin,
  Users,
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Wifi,
  Car,
  Coffee,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

import apiClient from '../lib/apiClient.js';

const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const apiCall = async (url, options = {}) => {
  if (!options.method || options.method.toUpperCase() === 'GET') {
    return apiClient.getJson(url, options);
    }
  return apiClient.callJson(url, options);
};

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    specialRequests: '',
    timeFromHour: '',
    timeFromMinute: '',
    timeFromPeriod: 'AM',
    timeToHour: '',
    timeToMinute: '',
    timeToPeriod: 'AM'
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showMultiDayModal, setShowMultiDayModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showFloatingMessage, setShowFloatingMessage] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [ratingRefreshTrigger, setRatingRefreshTrigger] = useState(0);


  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        const venueData = await apiCall(`/api/venues/${id}`);
        if (venueData.images && typeof venueData.images === 'string') {
          venueData.images = JSON.parse(venueData.images);
        }
        const normalized = { ...venueData, id: venueData.id || venueData._id };
        setVenue(normalized);
      } catch (err) {
        console.error('Error fetching venue details:', err);
        const userFriendlyMessage = getUserFriendlyError(err.message || err, 'general');
        setError(userFriendlyMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVenueDetails();
    }
  }, [id]);

  useEffect(() => {
    if (isLoggedIn && user) {
      setBookingForm(prev => ({
        ...prev,
        fullName: user.full_name || user.name || '',
        email: user.email || '',
        phone: user.mobileNumber || ''
      }));
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    const fetchUserBookingsForVenue = async () => {
      if (!isLoggedIn || !id) return;

      try {
        const bookings = await apiCall('/api/bookings/customer', { method: 'GET' });
        const venueBookings = bookings.filter(b => b.venue_id === id);
        setUserBookings(venueBookings);
      } catch (err) {
        console.error('Error fetching user bookings:', err);
      }
    };

    fetchUserBookingsForVenue();
  }, [isLoggedIn, id, ratingRefreshTrigger]);


  useEffect(() => {
    const fetchHeroRating = async () => {
      try {
        const data = await apiClient.getJson(`/api/ratings/venue/${id}`);
        const ratingElement = document.getElementById('hero-rating');
        const countElement = document.getElementById('hero-rating-count');
        if (ratingElement) {
          ratingElement.textContent = (data.averageRating || 0).toFixed(1);
        }
        if (countElement) {
          countElement.textContent = `(${data.totalRatings || 0})`;
        }
      } catch (err) {
        console.error('Error fetching ratings for hero:', err);
      }
    };

    if (id) {
      fetchHeroRating();
    }
  }, [id]);

  const handleFavoriteClick = async () => {
    if (!isLoggedIn) {
      setNotification({
        type: 'error',
        message: 'Please sign in to add venues to your favorites'
      });
      return;
    }
    await toggleFavorite(venue.id);
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingDialogOpen = (open) => {
    setShowBookingForm(open);
    if (open) {
      const today = new Date();
      setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  };

  const handleInquireSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate) {
      setNotification({
        type: 'error',
        message: 'Please select a date for your event'
      });
      return;
    }

    if (!bookingForm.timeFromHour || !bookingForm.timeFromMinute || !bookingForm.timeToHour || !bookingForm.timeToMinute) {
      setNotification({
        type: 'error',
        message: 'Please select both start and end times for your event'
      });
      return;
    }

    if (!isLoggedIn) {
      setNotification({
        type: 'error',
        message: 'Please sign in to make an inquiry'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const inquiryData = {
        venue_id: venue.id,
        venue_name: venue.name,
        user_details: {
          ...bookingForm,
          guestCount: parseInt(bookingForm.guestCount) || 0
        },
        event_date: selectedDate.toISOString().split('T')[0],
        event_time: {
          from: `${bookingForm.timeFromHour}:${bookingForm.timeFromMinute.padStart(2, '0')} ${bookingForm.timeFromPeriod}`,
          to: `${bookingForm.timeToHour}:${bookingForm.timeToMinute.padStart(2, '0')} ${bookingForm.timeToPeriod}`
        },
        inquiry_date: new Date().toISOString(),
        venue_owner: {
          name: venue.owner_name || '',
          email: venue.owner_email || '',
          phone: venue.owner_phone || ''
        }
      };

      await apiCall('/api/bookings/inquiry', {
        method: 'POST',
        body: JSON.stringify(inquiryData)
      });

      setShowFloatingMessage(true);

      handleBookingDialogOpen(false);
      setSelectedDate(null);
      setBookingForm(prev => ({
        ...prev,
        eventType: '',
        guestCount: '',
        specialRequests: '',
        timeFromHour: '',
        timeFromMinute: '',
        timeFromPeriod: 'AM',
        timeToHour: '',
        timeToMinute: '',
        timeToPeriod: 'AM'
      }));

      setTimeout(() => {
        scrollToTop();
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setNotification({
        type: 'error',
        message: 'Failed to send inquiry. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMultiDayBookingSubmit = async (bookingData) => {
    if (!isLoggedIn) {
      setNotification({
        type: 'error',
        message: 'Please sign in to make an inquiry'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Use first date as event_date for the inquiry
      const firstDate = bookingData.dates_timings && bookingData.dates_timings.length > 0
        ? bookingData.dates_timings[0].date
        : new Date().toISOString().split('T')[0];

      const inquiryData = {
        venue_id: bookingData.venue_id,
        venue_name: bookingData.venue_name,
        user_details: bookingData.user_details,
        event_date: firstDate,
        dates_timings: bookingData.dates_timings,
        pricing: bookingData.pricing,
        inquiry_date: bookingData.inquiry_date
      };

      await apiCall('/api/bookings/inquiry', {
        method: 'POST',
        body: JSON.stringify(inquiryData)
      });

      setShowFloatingMessage(true);
      setShowMultiDayModal(false);

      setTimeout(() => {
        scrollToTop();
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error submitting multi-day inquiry:', error);
      setNotification({
        type: 'error',
        message: 'Failed to send inquiry. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % venueImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + venueImages.length) % venueImages.length);
  };

  const handleShareClick = async () => {
    const venueUrl = window.location.href;
    let copied = false;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(venueUrl);
        copied = true;
      }
    } catch (clipboardError) {
      console.log('Clipboard API blocked, trying fallback method...');
      try {
        const textArea = document.createElement('textarea');
        textArea.value = venueUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copied = true;
      } catch (fallbackError) {
        console.error('Both copy methods failed:', fallbackError);
        copied = false;
      }
    }

    if (copied) {
      toast({
        title: 'Share link copied'
      });
    } else {
      toast({
        title: 'Failed to copy link',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Loading...</h2>
          <p className="text-gray-500">Fetching venue details...</p>
        </Card>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Venue Not Found</h2>
          <p className="text-gray-500 mb-6">The venue you're looking for doesn't exist or couldn't be loaded.</p>
          <Button asChild onClick={scrollToTop}>
            <Link to="/venues">Browse All Venues</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const venueImages = venue.images && venue.images.length > 0 
    ? venue.images 
    : [venue.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop"];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="w-full">
        {/* Full Width Image Gallery with Overlay Info */}
        <motion.div
          id="hero-section"
          className="relative w-full h-96 md:h-[550px] overflow-hidden flex items-center justify-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={transition}
        >
          {/* Blurred background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${venueImages[selectedImage]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(20px) brightness(0.7)',
            }}
          />
          <img
            src={venueImages[selectedImage]}
            alt={venue.name}
            className="w-full h-full object-contain relative z-10"
          />

          {/* Image Navigation */}
          {venueImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {venueImages.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {venueImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    selectedImage === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Top Right Actions */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              onClick={handleFavoriteClick}
            >
              <Heart className={`h-4 w-4 ${isFavorite(venue.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              onClick={handleShareClick}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Top Left - Back Button & Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
            <Button
              asChild
              variant="ghost"
              className="bg-white/90 hover:bg-white text-venue-indigo hover:text-venue-purple"
              onClick={scrollToTop}
            >
              <Link to="/venues" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Badge className="bg-venue-indigo text-white text-lg px-4 py-2">
              {venue.type || 'Venue'}
            </Badge>
          </div>

          {/* Bottom Overlay - Venue Info Card */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent pt-20 pb-6 px-4 md:px-6 z-20">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                {/* Left: Venue Details */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{venue.name}</h1>
                  <div className="flex items-center gap-4 flex-wrap mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-sm text-white" id="hero-rating">--</span>
                      <span className="text-sm text-white/80" id="hero-rating-count">-</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white mb-3">
                    <MapPin className="h-5 w-5 flex-shrink-0" />
                    <span className="text-lg">{venue.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <Users className="h-5 w-5 flex-shrink-0" />
                    <span className="text-lg">Up to {venue.capacity} guests</span>
                  </div>
                </div>

                {/* Right: Price & Booking Button */}
                <div className="flex flex-col gap-4 items-start md:items-end">
                  {(() => {
                    const priceBreakdown = getPriceBreakdownComponent(venue.price);
                    const finalPrice = priceBreakdown.items.find(item => item.type === 'final');
                    return (
                      <div className="text-white">
                        <p className="text-sm text-white/80 mb-1">Starting from</p>
                        <p className="text-3xl font-bold">{finalPrice?.formatted || 'Contact for pricing'}</p>
                        <p className="text-sm text-white/80">per day</p>
                      </div>
                    );
                  })()}
                  <Button
                    onClick={() => {
                      if (!isLoggedIn) {
                        setShowLoginDialog(true);
                        return;
                      }
                      setShowMultiDayModal(true);
                    }}
                    className="bg-venue-indigo hover:bg-[#5a6549] text-white w-full md:w-auto px-8"
                    size="lg"
                  >
                    Start Booking Process
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Thumbnail Gallery */}
        {venueImages.length > 1 && (
          <motion.div
            className="max-w-7xl mx-auto px-4 py-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {venueImages.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-venue-indigo' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: (index % 8) * 0.03 }}
                >
                  <img
                    loading="lazy"
                    src={image}
                    alt={`${venue.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Content - Two Column Layout */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            {/* Left Column */}
            <div className="space-y-6">
              {/* About Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-venue-dark">About This Venue</h2>
                  <p className="text-gray-600 leading-relaxed text-base">{venue.description}</p>
                </CardContent>
              </Card>

              {/* Facilities & Amenities */}
              {venue.facilities && venue.facilities.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-venue-dark">Facilities & Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {venue.facilities.map((facility, index) => (
                        <motion.div
                          key={index}
                          className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          variants={fadeUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ ...transition, delay: (index % 8) * 0.04 }}
                        >
                          <span className="font-medium text-sm text-center text-gray-700">{facility}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Price Breakdown Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-venue-dark">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Price Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-6 border border-venue-indigo/10">
                    {(() => {
                      const priceBreakdown = getPriceBreakdownComponent(venue.price);
                      return (
                        <div className="space-y-3">
                          {priceBreakdown.items.map((item, index) => (
                            <div key={index} className={`flex justify-between ${
                              item.type === 'subtotal' ? 'border-t pt-3 mt-3 font-medium text-gray-700' :
                              item.type === 'discount' ? 'text-green-600 font-medium' :
                              item.type === 'fee' ? 'text-gray-600' :
                              item.type === 'final' ? 'border-t pt-3 mt-3 text-lg font-bold text-venue-indigo' :
                              'text-gray-600'
                            }`}>
                              <span>{item.label}</span>
                              <span>{item.formatted}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                    <div className="mt-3 text-xs text-gray-500 text-center pt-3 border-t">per day</div>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Directions Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-venue-dark">Location & Directions</h2>
                  <div className="flex items-start gap-4 mb-6">
                    <MapPin className="h-6 w-6 text-venue-indigo flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-600 text-lg font-medium mb-1">{venue.location}</p>
                      <p className="text-gray-500 text-sm">{venue.address || 'Address details coming soon'}</p>
                    </div>
                  </div>
                  {venue.googleMapsUrl && (
                    <a
                      href={venue.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-venue-indigo hover:bg-[#5a6549] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      View on Google Maps
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Full Width Sections Below */}
          <motion.div
            className="space-y-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            {/* Customer Feedback Section - Full Width */}
            <FeedbackDisplay venueId={id} key={ratingRefreshTrigger} />

            {/* Rate This Venue Section */}
            {isLoggedIn && userBookings && userBookings.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-venue-dark">Share Your Experience</h2>
                  <p className="text-gray-600 mb-4">Have you already hosted an event at this venue? Share your feedback with others!</p>
                  <Button
                    onClick={() => setShowRatingForm(true)}
                    className="w-full bg-venue-indigo hover:bg-[#5a6549] text-white"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Rate This Venue
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingForm} onOpenChange={handleBookingDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-5xl sm:rounded-2xl p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Start Booking</DialogTitle>
            <DialogDescription>
              Provide your details to send an inquiry to {venue?.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInquireSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your full name, email, and phone number are pre-filled from your account and cannot be changed here. To update these details, please visit your account settings.
              </p>
            </div>

            {/* Calendar + Details */}
            <div>
              <div className="flex flex-col md:flex-row gap-2 items-start">
                {/* Left: Calendar */}
                <div className="w-full md:w-[296px]">
                  <Label className="text-base font-semibold">Select Event Date</Label>
                  <div className="mt-2 w-full overflow-x-auto border border-gray-300 rounded-md p-2 shadow-md hover:shadow-lg">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      month={calendarMonth}
                      onMonthChange={(month) => {
                        const today = new Date();
                        const currentYear = today.getFullYear();
                        const currentMonth = today.getMonth();
                        const selectedYear = month.getFullYear();
                        const selectedMonth = month.getMonth();

                        // Allow current month and any future months
                        if (selectedYear > currentYear || (selectedYear === currentYear && selectedMonth >= currentMonth)) {
                          setCalendarMonth(month);
                        }
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date <= today;
                      }}
                      className="w-auto"
                      classNames={{ table: "w-auto" }}
                    />
                  </div>
                  {selectedDate && (
                    <p className="text-sm text-venue-indigo mt-2 font-medium">
                      Selected: {selectedDate.toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Right: Details */}
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor="fullName">Full Name*</Label>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold">Locked</span>
                      </div>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={bookingForm.fullName}
                        onChange={handleBookingFormChange}
                        placeholder="Enter your full name"
                        required
                        disabled
                        className="mt-1 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor="email">Email*</Label>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold">Locked</span>
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={bookingForm.email}
                        onChange={handleBookingFormChange}
                        placeholder="name@example.com"
                        required
                        disabled
                        className="mt-1 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor="phone">Phone Number*</Label>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold">Locked</span>
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={bookingForm.phone}
                        onChange={handleBookingFormChange}
                        placeholder="10-digit mobile number"
                        required
                        disabled
                        className="mt-1 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventType">Event Type*</Label>
                      <Input
                        id="eventType"
                        name="eventType"
                        value={bookingForm.eventType}
                        onChange={handleBookingFormChange}
                        placeholder="e.g., Wedding Reception, Conference"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guestCount">Expected Guest Count*</Label>
                      <Input
                        id="guestCount"
                        name="guestCount"
                        type="number"
                        value={bookingForm.guestCount}
                        onChange={handleBookingFormChange}
                        placeholder="Expected number of guests"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label>Event Start Time*</Label>
                      <div className="flex gap-2 items-end mt-1">
                        <div className="flex-1">
                          <Label className="text-xs text-gray-600">Hour</Label>
                          <Input
                            name="timeFromHour"
                            type="number"
                            min="1"
                            max="12"
                            value={bookingForm.timeFromHour}
                            onChange={handleBookingFormChange}
                            placeholder="HH"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs text-gray-600">Minute</Label>
                          <Input
                            name="timeFromMinute"
                            type="number"
                            min="0"
                            max="59"
                            value={bookingForm.timeFromMinute}
                            onChange={handleBookingFormChange}
                            placeholder="MM"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs text-gray-600">Period</Label>
                          <select
                            name="timeFromPeriod"
                            value={bookingForm.timeFromPeriod}
                            onChange={handleBookingFormChange}
                            className="w-full h-10 mt-1 px-3 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Event End Time*</Label>
                      <div className="flex gap-2 items-end mt-1">
                        <div className="flex-1">
                          <Label className="text-xs text-gray-600">Hour</Label>
                          <Input
                            name="timeToHour"
                            type="number"
                            min="1"
                            max="12"
                            value={bookingForm.timeToHour}
                            onChange={handleBookingFormChange}
                            placeholder="HH"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs text-gray-600">Minute</Label>
                          <Input
                            name="timeToMinute"
                            type="number"
                            min="0"
                            max="59"
                            value={bookingForm.timeToMinute}
                            onChange={handleBookingFormChange}
                            placeholder="MM"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs text-gray-600">Period</Label>
                          <select
                            name="timeToPeriod"
                            value={bookingForm.timeToPeriod}
                            onChange={handleBookingFormChange}
                            className="w-full h-10 mt-1 px-3 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={bookingForm.specialRequests}
                      onChange={handleBookingFormChange}
                      placeholder="Any special requests or details (optional)"
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleBookingDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedDate || !bookingForm.timeFromHour || !bookingForm.timeFromMinute || !bookingForm.timeToHour || !bookingForm.timeToMinute}
                className="bg-venue-indigo hover:bg-[#5a6549] text-white w-full sm:w-auto"
              >
                {isSubmitting ? 'Sending Inquiry...' : 'Send Inquiry'}
              </Button>
            </DialogFooter>

            <div className="text-xs text-gray-500 text-center">
              Your inquiry will be sent to the venue owner and our team. We'll get back to you within 24 hours.
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              Without logging in, you cannot start the booking process. Please sign in to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Close
            </Button>
            <Button asChild className="bg-venue-indigo hover:bg-[#5a6549] text-white">
              <Link to="/signin">Go to Sign In</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Multi-Day Booking Modal */}
      <MultiDayBookingModal
        open={showMultiDayModal}
        onOpenChange={setShowMultiDayModal}
        venue={venue}
        user={user}
        onSubmit={handleMultiDayBookingSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Rating Form Modal */}
      {isLoggedIn && userBookings && userBookings.length > 0 && (
        <RatingForm
          bookingId={userBookings[0]?._id}
          venueId={id}
          venueName={venue?.name}
          isOpen={showRatingForm}
          onClose={() => setShowRatingForm(false)}
          onRatingSubmitted={() => {
            setRatingRefreshTrigger(prev => prev + 1);
            setShowRatingForm(false);
          }}
        />
      )}

      <FloatingMessage
        isVisible={showFloatingMessage}
        onClose={() => {
          setShowFloatingMessage(false);
          setTimeout(() => {
            scrollToTop();
            navigate('/');
          }, 500);
        }}
        title="Thank you!"
        message="You will be contacted or notified soon regarding your response."
        type="success"
      />
    </div>
  );
}
