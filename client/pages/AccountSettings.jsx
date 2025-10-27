import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { getUserFriendlyError } from '../lib/errorMessages';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AutocompleteInput } from '@/components/ui/autocomplete-input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import apiClient from '../lib/apiClient.js';
import { Badge } from '@/components/ui/badge';
import AddVenueForm from '@/components/AddVenueForm';
import EditVenueForm from '@/components/EditVenueForm';
import DeleteAccountDialog from '@/components/DeleteAccountDialog';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import venueService from '../services/venueService';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Camera,
  Save,
  Eye,
  EyeOff,
  BarChart3,
  Building,
  Calendar,
  Settings,
  Bell,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  Trash2,

  MapPin,
  Users,
  Check,
  X,
  CreditCard,
  Link as LinkIcon,
  CheckCheck,
  XCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { City, State as StateLib } from 'country-state-city';

const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export default function AccountSettings() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [addVenueDialogOpen, setAddVenueDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [editVenueDialogOpen, setEditVenueDialogOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalVenues: 0,
    activeVenues: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [userVenues, setUserVenues] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [togglingVenueId, setTogglingVenueId] = useState(null);
  const [emailVerificationOpen, setEmailVerificationOpen] = useState(false);
  const [emailVerificationOtp, setEmailVerificationOtp] = useState('');
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
  const [pendingProfileData, setPendingProfileData] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [otpResendLoading, setOtpResendLoading] = useState(false);
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);
  const [processingBookingId, setProcessingBookingId] = useState(null);
  const [processingPaymentBookingId, setProcessingPaymentBookingId] = useState(null);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    state: '',
    city: ''
  });
  const [stateInputValue, setStateInputValue] = useState('');
  const [cityInputValue, setCityInputValue] = useState('');

  // Get all Indian states
  const allStates = useMemo(() => {
    return StateLib.getStatesOfCountry('IN')
      .map(state => ({ code: state.isoCode, name: state.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Get cities for selected state
  const citiesForState = useMemo(() => {
    if (profileData.state) {
      return City.getCitiesOfState('IN', profileData.state)
        .map(city => city.name)
        .sort((a, b) => a.localeCompare(b));
    }
    return [];
  }, [profileData.state]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Handle OTP resend cooldown
  useEffect(() => {
    if (otpResendCooldown > 0) {
      const timer = setTimeout(() => setOtpResendCooldown(otpResendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendCooldown]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.mobileNumber || '',
        businessName: user.business_name || '',
        state: user.state || '',
        city: user.city || ''
      });

      // Initialize the input display values
      if (user.state && allStates.length > 0) {
        const stateName = allStates.find(s => s.code === user.state)?.name || '';
        setStateInputValue(stateName);
      }
      if (user.city) {
        setCityInputValue(user.city);
      }

      if (!activeTab) {
        setActiveTab(user?.userType === 'venue-owner' ? 'overview' : 'notifications');
      }

      if (user?.userType === 'venue-owner') {
        fetchDashboardStats();
        fetchVenues();
        fetchBookings();
      } else if (user?.userType === 'customer') {
        if (activeTab === 'bookings') {
          fetchCustomerBookings();
        } else if (activeTab === 'notifications') {
          fetchNotifications();
        }
      }
    }
  }, [user, activeTab, allStates]);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        apiClient.getJson('/api/venues/owner/dashboard-stats'),
        apiClient.getJson('/api/bookings/owner/recent')
      ]);

      setDashboardStats({
        totalVenues: statsRes.totalVenues || 0,
        activeVenues: statsRes.activeVenues || 0,
        totalBookings: statsRes.totalBookings || 0,
        totalRevenue: statsRes.totalRevenue || 0
      });

      setRecentBookings(bookingsRes || []);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      setVenuesLoading(true);
      const res = await apiClient.getJson('/api/venues/owner/my-venues');
      setUserVenues(Array.isArray(res) ? res : res?.venues || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setVenuesLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const res = await apiClient.getJson('/api/bookings/owner');
      setUserBookings(Array.isArray(res) ? res : res?.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const res = await apiClient.getJson('/api/bookings/customer/notifications');
      setNotifications(Array.isArray(res) ? res : res?.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const fetchCustomerBookings = async () => {
    try {
      setBookingsLoading(true);
      const res = await apiClient.getJson('/api/bookings/customer');
      setUserBookings(Array.isArray(res) ? res : res?.bookings || []);
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      setUserBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      setProcessingBookingId(bookingId);
      await apiClient.callJson(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });

      setUserBookings(prev =>
        prev.map(b =>
          b._id === bookingId || b.id === bookingId
            ? { ...b, status: newStatus }
            : b
        )
      );

      const statusLabel = newStatus === 'confirmed' ? 'accepted' : 'declined';
      toast.success(`Booking ${statusLabel} successfully`);

      await fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error(getUserFriendlyError(error.message || error, 'general'));
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleToggleVenueActive = async (venue) => {
    try {
      setTogglingVenueId(venue._id || venue.id);
      const response = await venueService.toggleVenueActive(venue._id || venue.id);

      setUserVenues(prev =>
        prev.map(v =>
          (v._id === venue._id || v.id === venue.id)
            ? { ...v, is_active: response.is_active }
            : v
        )
      );

      toast.success(response.message);
    } catch (error) {
      console.error('Error toggling venue:', error);
      toast.error(getUserFriendlyError(error.message || error, 'general'));
    } finally {
      setTogglingVenueId(null);
    }
  };

  const handlePaymentClick = async (bookingId, amount, venueName) => {
    try {
      setProcessingPaymentBookingId(bookingId);

      const orderResponse = await apiClient.postJson('/api/payments/create-order', {
        bookingId: bookingId
      });

      if (!orderResponse.success || !orderResponse.order) {
        throw new Error(orderResponse.error || 'Failed to create payment order');
      }

      const options = {
        key: orderResponse.key_id,
        amount: orderResponse.order.amount,
        currency: 'INR',
        name: 'Planzia',
        description: `Payment for ${venueName}`,
        order_id: orderResponse.order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await apiClient.postJson('/api/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              booking_id: bookingId
            });

            toast.success('Payment successful! Your booking is confirmed.');
            await fetchCustomerBookings();
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error(getUserFriendlyError(error.message || error, 'general'));
          } finally {
            setProcessingPaymentBookingId(null);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.mobileNumber || ''
        },
        theme: {
          color: '#5046e5'
        },
        modal: {
          ondismiss: () => {
            setProcessingPaymentBookingId(null);
            toast.info('Payment cancelled');
          }
        }
      };

      const Razorpay = window.Razorpay;
      if (!Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        toast.error(response.error.description || 'Payment failed');
        setProcessingPaymentBookingId(null);
      });

      rzp.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      const userFriendlyMessage = getUserFriendlyError(error.message || error, 'payment');
      toast.error(userFriendlyMessage);
      setProcessingPaymentBookingId(null);
    }
  };

  const handleProfileInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (profileData.phone && !/^[0-9]{10}$/.test(profileData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!validateProfile()) {
      return;
    }

    try {
      setLoading(true);

      const response = await apiClient.putJson('/api/auth/update-profile', {
        ...profileData,
        mobileNumber: profileData.phone
      });

      // Check if email verification is required
      if (response.requiresVerification) {
        setPendingProfileData(profileData);
        setNewEmail(response.newEmail);
        setEmailVerificationOtp('');
        setEmailVerificationOpen(true);
        setOtpResendCooldown(60);
        toast.success('Verification code sent to your new email address');
        return;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      if (updateProfile) {
        updateProfile(profileData);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailUpdate = async () => {
    if (!emailVerificationOtp.trim()) {
      setErrors({ emailVerification: 'Please enter the verification code' });
      return;
    }

    try {
      setEmailVerificationLoading(true);
      setErrors({});

      const response = await apiClient.postJson('/api/auth/verify-email-update', {
        email: newEmail,
        otp: emailVerificationOtp
      });

      toast.success('Email verified and profile updated successfully!');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Update the profile data with the new email
      const updatedData = { ...profileData, email: newEmail };
      setProfileData(updatedData);

      if (updateProfile) {
        updateProfile(updatedData);
      }

      setEmailVerificationOpen(false);
      setEmailVerificationOtp('');
      setPendingProfileData(null);
      setNewEmail('');
    } catch (error) {
      console.error('Error verifying email:', error);
      const errorMsg = error.response?.data?.error || 'Invalid or expired verification code';
      setErrors({ emailVerification: errorMsg });
      toast.error(errorMsg);
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpResendCooldown > 0) {
      return;
    }

    try {
      setOtpResendLoading(true);

      await apiClient.postJson('/api/auth/resend-otp', {
        email: newEmail
      });

      toast.success('Verification code resent to your email');
      setOtpResendCooldown(60);
      setEmailVerificationOtp('');
    } catch (error) {
      console.error('Error resending OTP:', error);
      const errorMsg = error.response?.data?.error || 'Failed to resend verification code';
      toast.error(errorMsg);
    } finally {
      setOtpResendLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      setLoading(true);

      await apiClient.putJson('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setErrors({ password: '' });
      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      const userFriendlyMessage = getUserFriendlyError(error.message || error, 'password-reset');
      setErrors({ password: userFriendlyMessage });
      toast.error(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVenueSubmit = async (venueData) => {
    try {
      await apiClient.postJson('/api/venues', venueData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setAddVenueDialogOpen(false);
      fetchDashboardStats();
      fetchVenues();
    } catch (error) {
      console.error('Error adding venue:', error);
      throw error;
    }
  };

  const handleEditVenueSubmit = async (venueData) => {
    try {
      await apiClient.putJson(`/api/venues/${selectedVenue._id}`, venueData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setEditVenueDialogOpen(false);
      setSelectedVenue(null);
      fetchDashboardStats();
      fetchVenues();
    } catch (error) {
      console.error('Error updating venue:', error);
      throw error;
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      setDeleteAccountLoading(true);
      await apiClient.postJson('/api/auth/delete-account', { password });

      await logout();
      toast.success('Account deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      const userFriendlyMessage = getUserFriendlyError(error.message || error, 'general');
      toast.error(userFriendlyMessage);
    } finally {
      setDeleteAccountLoading(false);
      setDeleteAccountDialogOpen(false);
    }
  };

  const isVenueOwner = user?.userType === 'venue-owner';

  const sidebarTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'venues', label: 'Venues', icon: Building },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={transition}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-venue-dark">Account Settings</h1>
              <p className="text-gray-600 mt-2">Manage your profile and account preferences</p>
            </div>
            <Badge className={`${user?.userType === 'venue-owner' ? 'bg-venue-indigo' : 'bg-gray-500'} text-white`}>
              {user?.userType === 'venue-owner' ? 'Venue Owner' : 'Customer'}
            </Badge>
          </div>
        </motion.div>

        {/* Success Message */}
        {saveSuccess && (
          <motion.div
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={transition}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Your settings have been saved successfully!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* General Error */}
        {errors.general && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={transition}
          >
            <p className="text-sm text-red-800">{errors.general}</p>
          </motion.div>
        )}

        {isVenueOwner ? (
          // Venue Owner Layout with Sidebar
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Sidebar */}
            <motion.div
              className="md:col-span-1"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
            >
              <Card className="sticky top-8 p-4">
                <CardContent className="p-0">
                  <nav className="space-y-2">
                    {sidebarTabs.map((tab) => {
                      const IconComponent = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
                            isActive
                              ? 'bg-venue-indigo text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <IconComponent className="h-5 w-5 flex-shrink-0" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </motion.div>

            {/* Content Area */}
            <motion.div
              className="md:col-span-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...transition, delay: 0.05 }}
            >
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Header with Refresh */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-venue-dark">Dashboard Overview</h2>
                      <p className="text-gray-600 mt-1">Your venue business statistics</p>
                    </div>
                    <Button
                      onClick={fetchDashboardStats}
                      disabled={statsLoading}
                      variant="outline"
                      className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo hover:text-white"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Total Venues */}
                    <Card className="relative overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Total Venues</p>
                            <p className="text-3xl font-bold text-venue-dark">{dashboardStats.totalVenues}</p>
                          </div>
                          <div className="w-10 h-10 bg-venue-indigo bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building className="h-5 w-5 text-venue-indigo" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Total Bookings */}
                    <Card className="relative overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Total Bookings</p>
                            <p className="text-3xl font-bold text-venue-dark">{dashboardStats.totalBookings}</p>
                          </div>
                          <div className="w-10 h-10 bg-venue-purple bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-5 w-5 text-venue-purple" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Revenue */}
                    <Card className="relative overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                            <p className="text-3xl font-bold text-venue-dark">₹{dashboardStats.totalRevenue.toLocaleString('en-IN')}</p>
                          </div>
                          <div className="w-10 h-10 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Active Venues */}
                    <Card className="relative overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Active Venues</p>
                            <p className="text-3xl font-bold text-venue-dark">{dashboardStats.activeVenues}</p>
                          </div>
                          <div className="w-10 h-10 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Bookings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Bookings</CardTitle>
                      <CardDescription>Your latest venue bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {recentBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Calendar className="h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-gray-600">No recent bookings yet</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Venue Name</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Event Date</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {recentBookings.slice(0, 5).map((booking) => (
                                <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-3 px-4 text-gray-800">{booking.customer_name || 'N/A'}</td>
                                  <td className="py-3 px-4 text-gray-800">{booking.venue_name || 'N/A'}</td>
                                  <td className="py-3 px-4 text-gray-600">
                                    {new Date(booking.event_date || booking.created_at).toLocaleDateString('en-IN')}
                                  </td>
                                  <td className="py-3 px-4 text-gray-800 font-medium">₹{parseInt(booking.amount).toLocaleString('en-IN')}</td>
                                  <td className="py-3 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      booking.status === 'confirmed'
                                        ? 'bg-green-100 text-green-800'
                                        : booking.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {booking.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    {booking.status === 'pending' ? (
                                      <div className="flex gap-1">
                                        <Button
                                          onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}
                                          disabled={processingBookingId === booking._id}
                                          size="sm"
                                          className="bg-green-600 hover:bg-green-700 text-white h-7 px-2"
                                        >
                                          {processingBookingId === booking._id ? (
                                            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                                          ) : (
                                            <Check className="h-3 w-3" />
                                          )}
                                        </Button>
                                        <Button
                                          onClick={() => handleBookingStatusUpdate(booking._id, 'cancelled')}
                                          disabled={processingBookingId === booking._id}
                                          size="sm"
                                          variant="destructive"
                                          className="h-7 px-2"
                                        >
                                          {processingBookingId === booking._id ? (
                                            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                                          ) : (
                                            <X className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </div>
                                    ) : (
                                      <span className="text-gray-500 text-xs">—</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Venues Tab */}
              {activeTab === 'venues' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Your Venues</CardTitle>
                      <CardDescription>Manage all your registered venues</CardDescription>
                    </div>
                    <Button
                      onClick={fetchVenues}
                      disabled={venuesLoading}
                      variant="outline"
                      size="sm"
                      className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo hover:text-white"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${venuesLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {venuesLoading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-venue-indigo"></div>
                        <p className="text-gray-600 mt-4">Loading venues...</p>
                      </div>
                    ) : userVenues && userVenues.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {userVenues.map((venue) => (
                            <motion.div
                              key={venue._id || venue.id}
                              variants={fadeUp}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true, amount: 0.2 }}
                              transition={transition}
                            >
                              <Card className="h-full hover:shadow-lg transition-shadow">
                                <div className="relative h-48 overflow-hidden">
                                  <img
                                    src={venue.images && venue.images.length > 0 ? venue.images[0] : "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop"}
                                    alt={venue.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <Badge className="absolute top-3 left-3 bg-venue-indigo text-white">
                                    {venue.type || 'Venue'}
                                  </Badge>
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-semibold text-lg text-venue-dark mb-2 truncate">{venue.name}</h3>
                                  <div className="flex items-center text-gray-600 text-sm mb-2">
                                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                    <span className="truncate">{venue.location}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600 text-sm mb-3">
                                    <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                                    <span>Up to {venue.capacity} guests</span>
                                  </div>
                                  <div className="text-xl font-bold text-venue-indigo mb-4">
                                    ₹{parseInt(venue.price || venue.price_per_day || 0).toLocaleString('en-IN')}/day
                                  </div>
                                  <div className="mb-4 border-t border-b border-gray-200 py-3">
                                    <ToggleSwitch
                                      isActive={venue.is_active !== false}
                                      onChange={() => handleToggleVenueActive(venue)}
                                      disabled={togglingVenueId === (venue._id || venue.id)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Button
                                      asChild
                                      variant="outline"
                                      className="w-full border-venue-indigo text-venue-indigo hover:bg-venue-indigo hover:text-white"
                                    >
                                      <Link to={`/venue/${venue._id || venue.id}`}>
                                        View Details
                                      </Link>
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setSelectedVenue(venue);
                                        setEditVenueDialogOpen(true);
                                      }}
                                      variant="outline"
                                      className="w-full border-venue-purple text-venue-purple hover:bg-venue-purple hover:text-white transition-colors"
                                    >
                                      Edit Venue
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                        <div className="mt-6 flex justify-center">
                          <Button
                            onClick={() => setAddVenueDialogOpen(true)}
                            className="bg-venue-indigo hover:bg-venue-purple text-white"
                          >
                            Add Another Venue
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Building className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 mb-4">No venues added yet</p>
                        <Button
                          onClick={() => setAddVenueDialogOpen(true)}
                          className="bg-venue-indigo hover:bg-venue-purple"
                        >
                          Add Your First Venue
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Venue Bookings</CardTitle>
                      <CardDescription>View and manage all bookings for your venues</CardDescription>
                    </div>
                    <Button
                      onClick={fetchBookings}
                      disabled={bookingsLoading}
                      variant="outline"
                      size="sm"
                      className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo hover:text-white"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${bookingsLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {bookingsLoading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-venue-indigo"></div>
                        <p className="text-gray-600 mt-4">Loading bookings...</p>
                      </div>
                    ) : userBookings && userBookings.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Venue</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Event Date</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Guests</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Booking Status</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment Status</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userBookings.map((booking) => (
                              <tr key={booking._id || booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">{booking.venue_name || 'N/A'}</span>
                                    <span className="text-xs text-gray-500">{booking.venue_location || 'N/A'}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-600">
                                  {new Date(booking.event_date).toLocaleDateString('en-IN')}
                                </td>
                                <td className="py-3 px-4 text-gray-600">
                                  {booking.guest_count}
                                </td>
                                <td className="py-3 px-4 text-gray-800 font-medium">
                                  ₹{parseInt(booking.amount).toLocaleString('en-IN')}
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    booking.status === 'confirmed'
                                      ? 'bg-green-100 text-green-800'
                                      : booking.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    booking.payment_status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : booking.payment_status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : booking.payment_status === 'failed'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {booking.payment_status || 'Not Paid'}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  {booking.status === 'pending' ? (
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => handleBookingStatusUpdate(booking._id || booking.id, 'confirmed')}
                                        disabled={processingBookingId === (booking._id || booking.id)}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        {processingBookingId === (booking._id || booking.id) ? (
                                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        ) : (
                                          <>
                                            <Check className="h-4 w-4 mr-1" />
                                            Accept
                                          </>
                                        )}
                                      </Button>
                                      <Button
                                        onClick={() => handleBookingStatusUpdate(booking._id || booking.id, 'cancelled')}
                                        disabled={processingBookingId === (booking._id || booking.id)}
                                        size="sm"
                                        variant="destructive"
                                      >
                                        {processingBookingId === (booking._id || booking.id) ? (
                                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        ) : (
                                          <>
                                            <X className="h-4 w-4 mr-1" />
                                            Decline
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 text-sm">No actions available</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Calendar className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-600">No bookings yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Profile Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>
                        Update your personal information and contact details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <form onSubmit={handleSaveProfile}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Name */}
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) => handleProfileInputChange('name', e.target.value)}
                              placeholder="Enter your full name"
                              className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                              <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                          </div>

                          {/* Email */}
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => handleProfileInputChange('email', e.target.value)}
                                placeholder="Enter your email"
                                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                              />
                            </div>
                            {errors.email && (
                              <p className="text-sm text-red-600">{errors.email}</p>
                            )}
                          </div>

                          {/* Phone */}
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="phone"
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                                placeholder="Enter your phone number"
                                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                              />
                            </div>
                            {errors.phone && (
                              <p className="text-sm text-red-600">{errors.phone}</p>
                            )}
                          </div>

                          {/* Business Name */}
                          <div className="space-y-2">
                            <Label htmlFor="businessName" className={user?.userType === 'customer' ? 'text-gray-400' : ''}>
                              Business Name <span className="text-gray-400 text-xs">{user?.userType === 'customer' ? '(Venue Owner only)' : ''}</span>
                            </Label>
                            <Input
                              id="businessName"
                              disabled={user?.userType === 'customer'}
                              value={profileData.businessName}
                              onChange={(e) => handleProfileInputChange('businessName', e.target.value)}
                              placeholder={user?.userType === 'customer' ? 'Not available for customers' : 'Enter your business name'}
                              className={user?.userType === 'customer' ? 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-60' : ''}
                            />
                          </div>

                          {/* State */}
                          <div className="space-y-2">
                            <Label>State</Label>
                            <AutocompleteInput
                              options={allStates.map(s => s.name)}
                              value={stateInputValue}
                              onChange={(typedValue) => {
                                setStateInputValue(typedValue);
                                const selectedState = allStates.find(s => s.name.toLowerCase() === typedValue.toLowerCase());
                                if (selectedState) {
                                  handleProfileInputChange('state', selectedState.code);
                                  handleProfileInputChange('city', '');
                                  setCityInputValue('');
                                }
                              }}
                              placeholder="Type to search..."
                              className={`h-10 ${errors.state ? 'border-red-300' : 'border-gray-300'} focus:border-indigo-500`}
                            />
                          </div>

                          {/* City */}
                          <div className="space-y-2">
                            <Label>City</Label>
                            <AutocompleteInput
                              options={citiesForState}
                              value={cityInputValue}
                              onChange={(typedCity) => {
                                setCityInputValue(typedCity);
                                if (citiesForState.includes(typedCity)) {
                                  handleProfileInputChange('city', typedCity);
                                }
                              }}
                              placeholder={!profileData.state ? 'Select state first' : 'Type to search...'}
                              disabled={!profileData.state}
                              className={`h-10 ${errors.city ? 'border-red-300' : 'border-gray-300'} ${!profileData.state ? 'opacity-50' : ''} focus:border-indigo-500`}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-6">
                          <Button
                            type="submit"
                            disabled={loading}
                            className="bg-venue-indigo hover:bg-venue-purple"
                          >
                            {loading ? (
                              <>Saving...</>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Profile
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Change Password */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lock className="h-5 w-5 mr-2" />
                        Change Password
                      </CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {errors.password && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                          <p className="text-sm text-red-800">{errors.password}</p>
                        </div>
                      )}

                      <form onSubmit={handleChangePassword} className="space-y-6">
                        {/* Current Password */}
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password *</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                              placeholder="Enter your current password"
                              className={errors.currentPassword ? 'border-red-500 pr-10' : 'pr-10'}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {errors.currentPassword && (
                            <p className="text-sm text-red-600">{errors.currentPassword}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* New Password */}
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password *</Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                                placeholder="Enter new password"
                                className={errors.newPassword ? 'border-red-500 pr-10' : 'pr-10'}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            {errors.newPassword && (
                              <p className="text-sm text-red-600">{errors.newPassword}</p>
                            )}
                          </div>

                          {/* Confirm Password */}
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                                placeholder="Confirm new password"
                                className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            {errors.confirmPassword && (
                              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={loading}
                            variant="outline"
                            className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo hover:text-white"
                          >
                            {loading ? 'Updating...' : 'Change Password'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Delete Account */}
                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <Trash2 className="h-5 w-5 mr-2" />
                        Delete Account
                      </CardTitle>
                      <CardDescription>
                        Permanently delete your account and all associated data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-red-800">
                          <strong>Warning:</strong> This action cannot be undone. Your account, venues, bookings, and all other data will be permanently deleted.
                        </p>
                      </div>
                      <Button
                        onClick={() => setDeleteAccountDialogOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete My Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          // Customer Layout with Sidebar
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Sidebar */}
            <motion.div
              className="md:col-span-1"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
            >
              <Card className="sticky top-8 p-4">
                <CardContent className="p-0">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
                        activeTab === 'bookings'
                          ? 'bg-venue-indigo text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">Bookings</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
                        activeTab === 'notifications'
                          ? 'bg-venue-indigo text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Bell className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">Notifications</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
                        activeTab === 'settings'
                          ? 'bg-venue-indigo text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Settings className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">Settings</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </motion.div>

            {/* Content Area */}
            <motion.div
              className="md:col-span-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...transition, delay: 0.05 }}
            >
              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        My Bookings
                      </CardTitle>
                      <CardDescription>View all your venue booking history and details</CardDescription>
                    </div>
                    <Button
                      onClick={fetchCustomerBookings}
                      disabled={bookingsLoading}
                      variant="outline"
                      size="sm"
                      className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo hover:text-white"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${bookingsLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {bookingsLoading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-venue-indigo"></div>
                        <p className="text-gray-600 mt-4">Loading bookings...</p>
                      </div>
                    ) : userBookings && userBookings.length > 0 ? (
                      <div className="space-y-4">
                        {userBookings.map((booking) => (
                          <motion.div
                            key={booking._id}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            transition={transition}
                          >
                            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                              <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Left Column - Venue and Event Details */}
                                  <div>
                                    <h3 className="text-lg font-semibold text-venue-dark mb-4">{booking.venue_name}</h3>

                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-sm text-gray-600">Location</p>
                                        <p className="flex items-center text-gray-800 font-medium">
                                          <MapPin className="h-4 w-4 mr-2 text-venue-indigo" />
                                          {booking.venue_location}
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-sm text-gray-600">Event Date</p>
                                        <p className="flex items-center text-gray-800 font-medium">
                                          <Calendar className="h-4 w-4 mr-2 text-venue-indigo" />
                                          {new Date(booking.event_date).toLocaleDateString('en-IN', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                          })}
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-sm text-gray-600">Event Type</p>
                                        <p className="text-gray-800 font-medium">{booking.event_type}</p>
                                      </div>

                                      <div>
                                        <p className="text-sm text-gray-600">Guest Count</p>
                                        <p className="flex items-center text-gray-800 font-medium">
                                          <Users className="h-4 w-4 mr-2 text-venue-indigo" />
                                          {booking.guest_count} guests
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right Column - Payment and Status */}
                                  <div>
                                    <div className="space-y-4">
                                      {/* Amount Section */}
                                      <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 mb-2">Amount</p>
                                        <p className="text-2xl font-bold text-venue-indigo">
                                          ₹{Number(booking.amount || booking.payment_amount || 0).toLocaleString('en-IN')}
                                        </p>
                                        {booking.payment_amount && booking.payment_amount !== booking.amount && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            Paid: ₹{Number(booking.payment_amount).toLocaleString('en-IN')}
                                          </p>
                                        )}
                                      </div>

                                      {/* Booking Status */}
                                      <div>
                                        <p className="text-sm text-gray-600 mb-2">Booking Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                          booking.status === 'confirmed'
                                            ? 'bg-green-100 text-green-800'
                                            : booking.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : booking.status === 'rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {booking.status}
                                        </span>
                                      </div>

                                      {/* Payment Status */}
                                      <div>
                                        <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                          booking.payment_status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : booking.payment_status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {booking.payment_status || 'Not Paid'}
                                        </span>
                                      </div>

                                      {/* Payment Button */}
                                      {booking.status === 'confirmed' && booking.payment_status !== 'completed' && (
                                        <Button
                                          onClick={() => handlePaymentClick(booking._id, booking.payment_amount || booking.amount, booking.venue_name)}
                                          disabled={processingPaymentBookingId === booking._id}
                                          className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
                                        >
                                          {processingPaymentBookingId === booking._id ? (
                                            <>
                                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                              Processing...
                                            </>
                                          ) : (
                                            <>
                                              <CreditCard className="h-4 w-4 mr-2" />
                                              Pay with Razorpay
                                            </>
                                          )}
                                        </Button>
                                      )}

                                      {/* Booked Date */}
                                      <div className="border-t border-gray-200 pt-4">
                                        <p className="text-xs text-gray-500">
                                          Booked on {new Date(booking.created_at).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Special Requirements - if any */}
                                {booking.special_requirements && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2">Special Requirements</p>
                                    <p className="text-gray-700 text-sm">{booking.special_requirements}</p>
                                  </div>
                                )}

                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Calendar className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 text-lg font-medium">No bookings yet</p>
                        <p className="text-gray-500 text-sm mt-1">Start booking venues to see your history here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Bell className="h-5 w-5 mr-2" />
                        Inquiry Updates
                      </CardTitle>
                      <CardDescription>Status updates on your venue inquiries</CardDescription>
                    </div>
                    <Button
                      onClick={fetchNotifications}
                      disabled={notificationsLoading}
                      variant="outline"
                      size="sm"
                      className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo hover:text-white"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${notificationsLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {notificationsLoading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-venue-indigo"></div>
                        <p className="text-gray-600 mt-4">Loading notifications...</p>
                      </div>
                    ) : notifications && notifications.length > 0 ? (
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            transition={transition}
                          >
                            <Card className={`border-l-4 ${
                              notification.status === 'confirmed'
                                ? 'border-l-green-500 bg-green-50'
                                : notification.status === 'cancelled'
                                ? 'border-l-red-500 bg-red-50'
                                : 'border-l-yellow-500 bg-yellow-50'
                            } hover:shadow-md transition-shadow`}>
                              <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Left Column - Notification Info */}
                                  <div>
                                    <div className="flex items-start gap-3 mb-3">
                                      {notification.status === 'confirmed' ? (
                                        <CheckCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                      ) : notification.status === 'cancelled' ? (
                                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                      ) : (
                                        <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                      )}
                                      <div>
                                        <h3 className="font-semibold text-venue-dark">
                                          {notification.status === 'confirmed' ? 'Inquiry Accepted' : notification.status === 'cancelled' ? 'Inquiry Declined' : 'Inquiry Pending'}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                      </div>
                                    </div>

                                    <div className="space-y-2 mt-3">
                                      <div>
                                        <p className="text-xs text-gray-500">Venue</p>
                                        <Link
                                          to={`/venue/${notification.venue_id}`}
                                          className="text-venue-indigo hover:underline font-medium flex items-center gap-1"
                                        >
                                          {notification.venue_name}
                                          <LinkIcon className="h-3 w-3" />
                                        </Link>
                                      </div>

                                      <div>
                                        <p className="text-xs text-gray-500">Event Date</p>
                                        <p className="text-sm font-medium text-gray-800">
                                          {new Date(notification.event_date).toLocaleDateString('en-IN', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                          })}
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-xs text-gray-500">Guest Count</p>
                                        <p className="text-sm font-medium text-gray-800">{notification.guest_count} guests</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right Column - Amount and Status */}
                                  <div className="flex flex-col justify-between">
                                    <div className="bg-white rounded-lg p-3 mb-3">
                                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                                      <p className="text-2xl font-bold text-venue-indigo">
                                        ₹{Number(notification.amount || 0).toLocaleString('en-IN')}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs text-gray-500 mb-2">Status</p>
                                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${
                                        notification.status === 'confirmed'
                                          ? 'bg-green-200 text-green-800'
                                          : notification.status === 'cancelled'
                                          ? 'bg-red-200 text-red-800'
                                          : 'bg-yellow-200 text-yellow-800'
                                      }`}>
                                        {notification.status === 'confirmed' ? '✓ Accepted' : notification.status === 'cancelled' ? '✗ Declined' : '⏳ Pending'}
                                      </span>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                      <p className="text-xs text-gray-500">
                                        Updated {new Date(notification.updated_at).toLocaleDateString('en-IN', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Bell className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 text-lg font-medium">No inquiry updates yet</p>
                        <p className="text-gray-500 text-sm mt-1">Check back here when venues respond to your inquiries</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Profile Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>
                        Update your personal information and contact details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <form onSubmit={handleSaveProfile}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Name */}
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) => handleProfileInputChange('name', e.target.value)}
                              placeholder="Enter your full name"
                              className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                              <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                          </div>

                          {/* Email */}
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => handleProfileInputChange('email', e.target.value)}
                                placeholder="Enter your email"
                                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                              />
                            </div>
                            {errors.email && (
                              <p className="text-sm text-red-600">{errors.email}</p>
                            )}
                          </div>

                          {/* Phone */}
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="phone"
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                                placeholder="Enter your phone number"
                                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                              />
                            </div>
                            {errors.phone && (
                              <p className="text-sm text-red-600">{errors.phone}</p>
                            )}
                          </div>

                          {/* State */}
                          <div className="space-y-2">
                            <Label>State</Label>
                            <AutocompleteInput
                              options={allStates.map(s => s.name)}
                              value={stateInputValue}
                              onChange={(typedValue) => {
                                setStateInputValue(typedValue);
                                const selectedState = allStates.find(s => s.name.toLowerCase() === typedValue.toLowerCase());
                                if (selectedState) {
                                  handleProfileInputChange('state', selectedState.code);
                                  handleProfileInputChange('city', '');
                                  setCityInputValue('');
                                }
                              }}
                              placeholder="Type to search..."
                              className={`h-10 ${errors.state ? 'border-red-300' : 'border-gray-300'} focus:border-indigo-500`}
                            />
                          </div>

                          {/* City */}
                          <div className="space-y-2">
                            <Label>City</Label>
                            <AutocompleteInput
                              options={citiesForState}
                              value={cityInputValue}
                              onChange={(typedCity) => {
                                setCityInputValue(typedCity);
                                if (citiesForState.includes(typedCity)) {
                                  handleProfileInputChange('city', typedCity);
                                }
                              }}
                              placeholder={!profileData.state ? 'Select state first' : 'Type to search...'}
                              disabled={!profileData.state}
                              className={`h-10 ${errors.city ? 'border-red-300' : 'border-gray-300'} ${!profileData.state ? 'opacity-50' : ''} focus:border-indigo-500`}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-6">
                          <Button
                            type="submit"
                            disabled={loading}
                            className="bg-venue-indigo hover:bg-venue-purple"
                          >
                            {loading ? (
                              <>Saving...</>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Profile
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Change Password */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lock className="h-5 w-5 mr-2" />
                        Change Password
                      </CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {errors.password && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                          <p className="text-sm text-red-800">{errors.password}</p>
                        </div>
                      )}

                      <form onSubmit={handleChangePassword} className="space-y-6">
                        {/* Current Password */}
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password *</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                              placeholder="Enter your current password"
                              className={errors.currentPassword ? 'border-red-500 pr-10' : 'pr-10'}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {errors.currentPassword && (
                            <p className="text-sm text-red-600">{errors.currentPassword}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* New Password */}
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password *</Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                                placeholder="Enter new password"
                                className={errors.newPassword ? 'border-red-500 pr-10' : 'pr-10'}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            {errors.newPassword && (
                              <p className="text-sm text-red-600">{errors.newPassword}</p>
                            )}
                          </div>

                          {/* Confirm Password */}
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                                placeholder="Confirm new password"
                                className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            {errors.confirmPassword && (
                              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={loading}
                            variant="outline"
                            className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo hover:text-white"
                          >
                            {loading ? 'Updating...' : 'Change Password'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Delete Account */}
                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <Trash2 className="h-5 w-5 mr-2" />
                        Delete Account
                      </CardTitle>
                      <CardDescription>
                        Permanently delete your account and all associated data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-red-800">
                          <strong>Warning:</strong> This action cannot be undone. Your account, bookings, and all other data will be permanently deleted.
                        </p>
                      </div>
                      <Button
                        onClick={() => setDeleteAccountDialogOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete My Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Add Venue Dialog */}
      <AddVenueForm
        isOpen={addVenueDialogOpen}
        onClose={() => setAddVenueDialogOpen(false)}
        onSubmit={handleAddVenueSubmit}
      />

      {/* Edit Venue Dialog */}
      <EditVenueForm
        isOpen={editVenueDialogOpen}
        onClose={() => {
          setEditVenueDialogOpen(false);
          setSelectedVenue(null);
        }}
        onSubmit={handleEditVenueSubmit}
        venue={selectedVenue}
      />

      {/* Email Verification Dialog */}
      <Dialog open={emailVerificationOpen} onOpenChange={setEmailVerificationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-venue-indigo" />
              Verify Your New Email
            </DialogTitle>
            <DialogDescription>
              We've sent a verification code to <strong>{newEmail}</strong>. Please enter it below to confirm your email change.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {errors.emailVerification && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{errors.emailVerification}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={emailVerificationOtp}
                onChange={(e) => {
                  setEmailVerificationOtp(e.target.value);
                  if (errors.emailVerification) {
                    setErrors(prev => ({ ...prev, emailVerification: '' }));
                  }
                }}
                maxLength="6"
                className={`text-center text-lg tracking-widest font-semibold ${
                  errors.emailVerification ? 'border-red-500' : ''
                }`}
                disabled={emailVerificationLoading}
              />
              <p className="text-xs text-gray-500">
                Check your email inbox or spam folder for the code.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Didn't receive the code?</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendOtp}
                disabled={otpResendCooldown > 0 || otpResendLoading}
                className="text-venue-indigo hover:text-venue-purple"
              >
                {otpResendCooldown > 0 ? (
                  <span>Resend in {otpResendCooldown}s</span>
                ) : otpResendLoading ? (
                  <span>Sending...</span>
                ) : (
                  <span>Resend Code</span>
                )}
              </Button>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEmailVerificationOpen(false);
                setEmailVerificationOtp('');
                setErrors({});
              }}
              disabled={emailVerificationLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleVerifyEmailUpdate}
              disabled={emailVerificationLoading || !emailVerificationOtp.trim()}
              className="bg-venue-indigo hover:bg-venue-purple"
            >
              {emailVerificationLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={deleteAccountDialogOpen}
        onOpenChange={setDeleteAccountDialogOpen}
        onConfirm={handleDeleteAccount}
        isLoading={deleteAccountLoading}
      />
    </div>
  );
}
