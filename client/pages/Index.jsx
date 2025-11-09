import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { scrollToTop } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AutocompleteInput } from '@/components/ui/autocomplete-input';
import venueService from '../services/venueService';
import { PUNE_AREAS, VENUE_TYPES } from '@/constants/venueOptions';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';
import { getUserFriendlyError } from '../lib/errorMessages';
import { getPricingInfo } from '../lib/priceUtils';
import {
  Search,
  MapPin,
  Users,
  Shield,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  Calendar,
  Award,
  Heart,
  Globe,
  Star,
  Zap,
  ThumbsUp
} from 'lucide-react';

import apiClient from '../lib/apiClient.js';
import { motion } from 'framer-motion';

const apiCall = async (url, options = {}) => {
  if (!options.method || options.method.toUpperCase() === 'GET') {
    return apiClient.getJson(url, options);
  }
  return apiClient.callJson(url, options);
};

const howItWorks = [
  {
    step: 1,
    title: "Browse Venues",
    description: "Explore curated venues tailored to your vision and needs",
    icon: Search
  },
  {
    step: 2,
    title: "Book Instantly",
    description: "Secure your booking with transparent pricing and instant confirmation",
    icon: CheckCircle
  },
  {
    step: 3,
    title: "Celebrate Without Stress",
    description: "Enjoy your event with our dedicated support throughout",
    icon: Calendar
  }
];

const features = [
  {
    title: "Verified Venues Only",
    description: "Every venue is expertly verified to guarantee quality and authenticity",
    icon: Shield
  },
  {
    title: "Transparent Pricing",
    description: "Crystal-clear pricing with zero hidden charges—what you see is what you pay",
    icon: DollarSign
  },
  {
    title: "24/7 Customer Support",
    description: "Dedicated support available around the clock to guide your journey",
    icon: Clock
  },
  {
    title: "Premium Selection",
    description: "Meticulously curated venues that exceed expectations",
    icon: Award
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Event Planner",
    text: "Planzia made finding the perfect venue incredibly simple. Highly recommended!",
    rating: 5,
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop"
  },
  {
    name: "Raj Patel",
    role: "Wedding Coordinator",
    text: "The transparency and support from Planzia's team was outstanding.",
    rating: 5,
    image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=100&h=100&fit=crop"
  },
  {
    name: "Priya Sharma",
    role: "Corporate Event Manager",
    text: "Best venue booking platform I've used. Professional and reliable.",
    rating: 5,
    image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=100&h=100&fit=crop"
  }
];

const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export default function Index() {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchVenue, setSearchVenue] = useState('');
  const [popularVenues, setPopularVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);
  const [venueTypes, setVenueTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();

  const handleFavoriteClick = async (venueId) => {
    if (!isLoggedIn) {
      window.dispatchEvent(new CustomEvent('app-error', { detail: { title: 'Sign in required', message: 'Please sign in to add venues to your favorites.' } }));
      return;
    }
    await toggleFavorite(venueId);
  };

  useEffect(() => {
    loadPopularVenues();
    loadFilterOptions();
  }, []);

  const loadPopularVenues = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/api/venues?limit=6');

      const venues = data.venues || data;

      const formattedVenues = venues.map(venue => {
        const basePrice = parseFloat(venue.price_per_day || venue.price);
        const pricingInfo = getPricingInfo(basePrice, 'listing');

        return {
          id: venue._id || venue.id,
          name: venue.name,
          location: venue.location,
          capacity: `Up to ${venue.capacity} guests`,
          price: pricingInfo.formattedPrice,
          image: venue.images && venue.images.length > 0 ? venue.images[0] : "https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?w=400&h=300&fit=crop&q=80",
          facilities: venue.facilities || [],
          rating: 0
        };
      });

      const venuesWithRatings = await Promise.all(
        formattedVenues.map(async (venue) => {
          try {
            const ratingData = await apiCall(`/api/ratings/venue/${venue.id}`);
            return {
              ...venue,
              rating: ratingData.averageRating || 0
            };
          } catch (error) {
            console.error(`Error fetching rating for venue ${venue.id}:`, error);
            return venue;
          }
        })
      );

      setPopularVenues(venuesWithRatings);
    } catch (error) {
      console.error('Error loading popular venues:', error);
      const fallbackVenues = [
        {
          id: 1,
          name: "Elegant Banquet Hall",
          location: "Kharadi",
          capacity: "Up to 300 guests",
          price: "₹45,000",
          image: "https://images.unsplash.com/photo-1670529776286-f426fb7ba42c?w=400&h=300&fit=crop&q=80",
          facilities: ["Air Conditioning", "Parking", "Catering"],
          rating: 4.8
        },
        {
          id: 2,
          name: "Garden Paradise Resort",
          location: "Wagholi",
          capacity: "Up to 500 guests",
          price: "₹65,000",
          image: "https://plus.unsplash.com/premium_photo-1664530452329-42682d3a73a7?w=400&h=300&fit=crop&q=80",
          facilities: ["Garden Area", "Swimming Pool", "Catering"],
          rating: 4.9
        },
        {
          id: 3,
          name: "Royal Conference Center",
          location: "Hinjewadi",
          capacity: "Up to 200 guests",
          price: "₹35,000",
          image: "https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?w=400&h=300&fit=crop&q=80",
          facilities: ["AV Equipment", "WiFi", "Air Conditioning"],
          rating: 4.7
        },
        {
          id: 4,
          name: "Riverside Event Space",
          location: "Baner",
          capacity: "Up to 400 guests",
          price: "₹55,000",
          image: "https://images.unsplash.com/photo-1670529776286-f426fb7ba42c?w=400&h=300&fit=crop&q=80",
          facilities: ["River View", "Modern Décor", "Full Catering"],
          rating: 4.8
        },
        {
          id: 5,
          name: "Diamond Palace",
          location: "Koregaon Park",
          capacity: "Up to 600 guests",
          price: "₹75,000",
          image: "https://plus.unsplash.com/premium_photo-1664530452329-42682d3a73a7?w=400&h=300&fit=crop&q=80",
          facilities: ["Luxury D��cor", "In-house Catering", "Parking"],
          rating: 4.9
        },
        {
          id: 6,
          name: "Heritage Garden Venue",
          location: "Wakad",
          capacity: "Up to 350 guests",
          price: "₹50,000",
          image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=300&fit=crop&q=80",
          facilities: ["Garden Setting", "Ambient Lighting", "Catering"],
          rating: 4.7
        }
      ];
      setPopularVenues(fallbackVenues);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (searchVenue) params.set('type', searchVenue);
    window.location.href = `/venues?${params.toString()}`;
  };

  const loadFilterOptions = async () => {
    try {
      setFilterOptionsLoading(true);
      const options = await venueService.getFilterOptions();
      setVenueTypes(options.venueTypes || []);
      setLocations(options.locations || []);
    } catch (error) {
      console.error('Error loading filter options:', error);
      setVenueTypes(VENUE_TYPES);
      setLocations(PUNE_AREAS);
    } finally {
      setFilterOptionsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-venue-lavender/10">
      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text and Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={transition}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-venue-dark mb-6 leading-tight">
                Plan Smarter, Celebrate Better.
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-xl">
                Discover and book stunning venues for your next event — effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
                  onClick={scrollToTop}
                >
                  <Link to="/venues">Find Venues</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo/10 hover:text-venue-indigo transition-colors"
                  onClick={scrollToTop}
                >
                  <Link to="/signup">List Your Venue</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...transition, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?w=600&h=500&fit=crop&q=80"
                  alt="Elegant event venue with decorated tables"
                  className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-venue-indigo/5 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to find and book your perfect venue
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-venue-lavender/50 group hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-venue-indigo to-venue-indigo/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-venue-dark text-center">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center text-sm">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section className="py-20 bg-venue-lavender/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              Featured Venues
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Carefully selected venues that match your every need
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(6).fill(0).map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <CardContent className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))
            ) : popularVenues.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No venues available at the moment</p>
                <p className="text-gray-400">Check back later for amazing venue listings</p>
              </div>
            ) : (
              popularVenues.map((venue, idx) => (
                <motion.div
                  key={venue.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: idx * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        loading="lazy"
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-10 w-10 bg-white/90 hover:bg-white shadow-lg"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFavoriteClick(venue.id);
                          }}
                        >
                          <Heart
                            className={`h-5 w-5 transition-colors ${
                              isFavorite(venue.id)
                                ? 'text-red-500 fill-red-500'
                                : 'text-gray-600 hover:text-red-500'
                            }`}
                          />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-venue-dark mb-2">{venue.name}</h3>
                      <div className="flex items-center mb-3">
                        {venue.rating > 0 ? (
                          <>
                            <div className="flex items-center text-venue-indigo">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < Math.floor(venue.rating) ? 'fill-venue-indigo' : 'fill-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">({venue.rating.toFixed(1)})</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">No ratings yet</span>
                        )}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-venue-indigo" />
                          {venue.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-venue-indigo" />
                          {venue.capacity}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {venue.facilities && venue.facilities.slice(0, 3).map((facility, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-venue-lavender/80 text-venue-indigo">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-2xl font-bold text-venue-indigo">{venue.price}</div>
                        <Button asChild className="bg-venue-indigo hover:bg-venue-indigo/90 text-white">
                          <Link to={`/venue/${venue.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-venue-indigo hover:bg-venue-indigo/90 text-white" onClick={scrollToTop}>
              <Link to="/venues">
                View All Venues
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Planiza Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
              className="hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&h=500&fit=crop&q=80"
                alt="People celebrating at a wedding event with wine glasses"
                className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                loading="lazy"
              />
            </motion.div>

            {/* Right: Content */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-8 leading-tight">
                Why Choose Planiza
              </h2>

              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex gap-4"
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ ...transition, delay: index * 0.1 }}
                    >
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-venue-lavender">
                          <Icon className="h-6 w-6 text-venue-indigo" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-venue-dark">{feature.title}</h3>
                        <p className="mt-2 text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-venue-indigo to-venue-indigo/80 opacity-90"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Host Your Next Event?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Browse our stunning collection of venues and book with confidence today.
            </p>
            <Button 
              asChild 
              size="lg"
              className="bg-white hover:bg-gray-50 text-venue-indigo hover:text-venue-indigo shadow-xl transition-all duration-200"
              onClick={scrollToTop}
            >
              <Link to="/venues">Start Booking</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
