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
import { RatingDisplay } from '@/components/RatingDisplay';
import { RatingForm } from '@/components/RatingForm';
import { FeedbackDisplay } from '@/components/FeedbackDisplay';
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
        user_details: bookingForm,
        event_date: selectedDate.toISOString().split('T')[0],
        event_time: {
          from: `${bookingForm.timeFromHour}:${bookingForm.timeFromMinute.padStart(2, '0')} ${bookingForm.timeFromPeriod}`,
          to: `${bookingForm.timeToHour}:${bookingForm.timeToMinute.padStart(2, '0')} ${bookingForm.timeToPeriod}`
        },
        inquiry_date: new Date().toISOString(),
        venue_owner: {
          name: venue.owner_name,
          email: venue.owner_email,
          phone: venue.owner_phone
        }
      };

      try {
        await apiCall('/api/bookings/inquiry', {
          method: 'POST',
          body: JSON.stringify(inquiryData)
        });
      } catch (apiError) {
        console.log('API not available, simulating inquiry submission');
      }

      setShowFloatingMessage(true);

      setShowBookingForm(false);
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
      setNotification({
        type: 'success',
        message: 'Venue link copied to clipboard!'
      });
    } else {
      setNotification({
        type: 'error',
        message: 'Failed to copy link. Please try again.'
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
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="w-full">
        {/* Full Width Image Gallery */}
        <motion.div
          className="relative w-full h-96 md:h-[500px] overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={transition}
        >
          <img
            src={venueImages[selectedImage]}
            alt={venue.name}
            className="w-full h-full object-cover"
          />


          {venueImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {venueImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
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

          <div className="absolute top-4 right-4 flex gap-2">
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

          {/* Back Button & Category Badge - Side by Side */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
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
        </motion.div>

        {venueImages.length > 1 && (
          <motion.div
            className="max-w-7xl mx-auto px-4 py-8 mb-8"
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
                    src={image}
                    alt={`${venue.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Venue Details */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
            >
              {/* Venue Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-bold text-venue-dark mb-3">{venue.name}</h1>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2" />
                          <span className="text-lg">{venue.location}</span>
                        </div>
                        {venue.googleMapsUrl && isLoggedIn && (
                          <a
                            href={venue.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-venue-indigo hover:text-venue-purple font-medium transition-colors flex items-center text-sm ml-4"
                          >
                            View on Google Maps
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-gray-500" />
                          <span className="text-gray-600">Up to {venue.capacity} guests</span>
                        </div>
                        <div>
                          <RatingDisplay venueId={id} key={ratingRefreshTrigger} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">About This Venue</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">{venue.description}</p>
                </CardContent>
              </Card>


              {/* Facilities */}
              {venue.facilities && venue.facilities.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Facilities & Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {venue.facilities.map((facility, index) => (
                        <motion.div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg"
                          variants={fadeUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ ...transition, delay: (index % 6) * 0.04 }}
                        >
                          {facility.toLowerCase().includes('wifi') && <Wifi className="h-5 w-5 mr-2 text-venue-indigo" />}
                          {facility.toLowerCase().includes('parking') && <Car className="h-5 w-5 mr-2 text-venue-indigo" />}
                          {facility.toLowerCase().includes('catering') && <Coffee className="h-5 w-5 mr-2 text-venue-indigo" />}
                          <span className="font-medium">{facility}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rate This Venue Section */}
              {isLoggedIn && userBookings && userBookings.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Share Your Experience</h2>
                    <p className="text-gray-600 mb-4">Have you already hosted an event at this venue? Share your feedback with others!</p>
                    <Button
                      onClick={() => setShowRatingForm(true)}
                      className="w-full bg-venue-indigo hover:bg-venue-purple text-white"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Rate This Venue
                    </Button>
                  </CardContent>
                </Card>
              )}

            </motion.div>

            {/* Right Column - Price Breakdown & Booking */}
            <motion.div
              className="space-y-6"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...transition, delay: 0.05 }}
            >
              {/* Price Breakdown Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Price Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-venue-indigo/10">
                    {(() => {
                      const priceBreakdown = getPriceBreakdownComponent(venue.price);
                      return (
                        <div className="space-y-2">
                          {priceBreakdown.items.map((item, index) => (
                            <div key={index} className={`flex justify-between text-sm ${
                              item.type === 'subtotal' ? 'border-t pt-2 mt-2 font-medium' :
                              item.type === 'discount' ? 'text-green-600 font-medium' :
                              item.type === 'final' ? 'border-t pt-2 mt-2 text-lg font-bold text-venue-indigo' :
                              ''
                            }`}>
                              <span>{item.label}:</span>
                              <span>{item.formatted}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                    <div className="mt-2 text-xs text-gray-500 text-center">per day</div>
                  </div>
                </CardContent>
              </Card>

              {/* Book This Venue Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Book This Venue
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to book?</h3>
                      <p className="text-gray-600 mb-4">Select your event date and fill in your details to send an inquiry.</p>
                      <Button
                        onClick={() => {
                          if (!isLoggedIn) {
                            setShowLoginDialog(true);
                            return;
                          }
                          setShowBookingForm(true);
                        }}
                        className="w-full bg-venue-indigo hover:bg-venue-purple text-white"
                        size="lg"
                      >
                        Start Booking Process
                      </Button>
                    </div>
                  </div>

                  <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
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
                              <div className="mt-2 w-full overflow-x-auto border rounded-lg p-2">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  disabled={(date) => date < new Date()}
                                  className="w-auto" classNames={{ table: "w-auto" }}
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
                            onClick={() => setShowBookingForm(false)}
                            className="w-full sm:w-auto"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting || !selectedDate || !bookingForm.timeFromHour || !bookingForm.timeFromMinute || !bookingForm.timeToHour || !bookingForm.timeToMinute}
                            className="bg-venue-indigo hover:bg-venue-purple text-white w-full sm:w-auto"
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
                        <Button asChild className="bg-venue-indigo hover:bg-venue-purple text-white">
                          <Link to="/signin">Go to Sign In</Link>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Feedback Section */}
        <motion.div
          className="mt-12 max-w-7xl mx-auto px-4 py-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={transition}
        >
          <FeedbackDisplay venueId={id} key={ratingRefreshTrigger} />
        </motion.div>
      </div>

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
