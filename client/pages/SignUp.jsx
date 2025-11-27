import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { State, City } from 'country-state-city';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AutocompleteInput } from '@/components/ui/autocomplete-input';
import { toast } from '@/components/ui/use-toast';
import { User, Building, Mail, Eye, EyeOff, Lock, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserFriendlyError } from '../lib/errorMessages';
import { motion } from 'framer-motion';

const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export default function SignUp() {
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    state: '',
    city: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [stateInputValue, setStateInputValue] = useState('');
  const [cityInputValue, setCityInputValue] = useState('');

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Get all Indian states
  const allStates = useMemo(() => {
    return State.getStatesOfCountry('IN')
      .map(state => ({ code: state.isoCode, name: state.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Get cities for selected state
  const citiesForState = useMemo(() => {
    if (formData.state) {
      return City.getCitiesOfState('IN', formData.state)
        .map(city => city.name)
        .sort();
    }
    return [];
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateFullName = (name) => {
    // Only alphabet letters and spaces allowed
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name.trim()) && name.trim().length > 0;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    // Exact 10 digits
    return digits.length === 10;
  };

  const validatePassword = (password) => {
    // Minimum 8 characters with uppercase, lowercase, special characters, and numbers
    if (password.length < 8) return false;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    return hasUppercase && hasLowercase && hasNumbers && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate user type selection
      if (!userType) {
        setError('Please select whether you are a Customer or Venue Owner.');
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!formData.fullName.trim()) {
        setError('Full name is required.');
        setLoading(false);
        return;
      }

      if (!validateFullName(formData.fullName)) {
        setError('Full name must contain only alphabet letters and spaces.');
        setLoading(false);
        return;
      }

      if (!formData.email.trim()) {
        setError('Email address is required.');
        setLoading(false);
        return;
      }

      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      if (!formData.phoneNumber.trim()) {
        setError('Phone number is required.');
        setLoading(false);
        return;
      }

      if (!validatePhone(formData.phoneNumber)) {
        setError('Please enter exactly 10 digits for the phone number.');
        setLoading(false);
        return;
      }

      if (!formData.state) {
        setError('Please select a state.');
        setLoading(false);
        return;
      }

      if (!formData.city) {
        setError('Please select a city.');
        setLoading(false);
        return;
      }

      if (!formData.password) {
        setError('Password is required.');
        setLoading(false);
        return;
      }

      if (!validatePassword(formData.password)) {
        setError('Password must be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and special characters.');
        setLoading(false);
        return;
      }

      if (!formData.confirmPassword) {
        setError('Please confirm your password.');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }

      if (!formData.agreeToTerms) {
        setError('Please agree to the terms and conditions to continue.');
        setLoading(false);
        return;
      }

      await register(
        formData.email,
        formData.fullName,
        userType,
        formData.password,
        formData.phoneNumber,
        formData.state,
        formData.city,
        formData.businessName || null
      );

      navigate('/verify-otp', {
        state: {
          email: formData.email,
          name: formData.fullName
        }
      });
    } catch (err) {
      setError(getUserFriendlyError(err, 'signup'));
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white/70 backdrop-blur-lg flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 pt-16">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={transition}
        >
          <h1 className="text-3xl font-bold text-venue-dark mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join Planzia to find amazing venues</p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...transition, delay: 0.05 }}
        >
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - User Type Selection */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="lg:sticky lg:top-8">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      I want to sign up as:
                    </label>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => {
                          setUserType('customer');
                          setFormData(prev => ({ ...prev, businessName: '' }));
                        }}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          userType === 'customer'
                            ? 'border-venue-indigo bg-venue-lavender'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <User className={`h-6 w-6 mt-1 flex-shrink-0 ${
                            userType === 'customer' ? 'text-venue-indigo' : 'text-gray-400'
                          }`} />
                          <div>
                            <div className="font-medium text-gray-900">Customer</div>
                            <div className="text-sm text-gray-500">Looking for venues</div>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUserType('venue-owner')}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          userType === 'venue-owner'
                            ? 'border-venue-indigo bg-venue-lavender'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Building className={`h-6 w-6 mt-1 flex-shrink-0 ${
                            userType === 'venue-owner' ? 'text-venue-indigo' : 'text-gray-400'
                          }`} />
                          <div>
                            <div className="font-medium text-gray-900">Venue Owner</div>
                            <div className="text-sm text-gray-500">List my venues</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-card text-gray-500">Or sign up with</span>
                    </div>
                  </div>

                  {/* Social Login Options */}
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        if (!userType) {
                          setError('Please select whether you are a Customer or Venue Owner first.');
                          return;
                        }
                        setLoading(true);
                        setError('');
                        await loginWithGoogle(userType);
                        toast({
                          title: 'Welcome to Planzia!',
                          description: 'Your account has been successfully created with Google.'
                        });
                        navigate('/');
                      } catch (error) {
                        console.error('Google auth error in SignUp:', error);
                        setError(getUserFriendlyError(error, 'signup'));
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="w-full h-12 border-gray-300 hover:border-venue-indigo hover:bg-venue-indigo hover:text-white"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {loading ? 'Signing up...' : 'Sign up with Google'}
                  </Button>

                  {/* Sign In Link */}
                  <div className="text-center">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link to="/signin" className="font-medium text-venue-indigo hover:text-venue-purple">
                      Sign in here
                    </Link>
                  </div>
                </div>

                {/* Right Column - Form Fields */}
                <div className="lg:col-span-2">
                  <div className="space-y-5">
                    {/* Row 1: Full Name and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Phone Number and Business Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            required
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter your 10-digit phone number"
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="businessName" className={`block text-sm font-medium mb-2 ${
                          userType === 'customer' ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          Business Name <span className="text-gray-400 text-xs">(Venue Owner only)</span>
                        </label>
                        <div className="relative">
                          <Building className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                            userType === 'customer' ? 'text-gray-300' : 'text-gray-400'
                          }`} />
                          <Input
                            id="businessName"
                            name="businessName"
                            type="text"
                            disabled={userType === 'customer'}
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder={userType === 'customer' ? 'Not available for customers' : 'Enter your business name'}
                            className={`pl-10 h-12 ${
                              userType === 'customer'
                                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                                : 'border-gray-300 focus:border-venue-indigo focus:ring-venue-indigo'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: State and City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <AutocompleteInput
                          options={allStates.map(s => s.name)}
                          value={stateInputValue}
                          onChange={(typedValue) => {
                            setStateInputValue(typedValue);
                            const selectedState = allStates.find(s => s.name.toLowerCase() === typedValue.toLowerCase());
                            if (selectedState) {
                              setFormData(prev => ({
                                ...prev,
                                state: selectedState.code,
                                city: ''
                              }));
                              setCityInputValue('');
                            }
                          }}
                          placeholder="Type to search..."
                          className="h-12 border-gray-300 focus:border-venue-indigo focus:ring-venue-indigo"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <AutocompleteInput
                          options={citiesForState}
                          value={cityInputValue}
                          onChange={(typedCity) => {
                            setCityInputValue(typedCity);
                            if (citiesForState.includes(typedCity)) {
                              setFormData(prev => ({
                                ...prev,
                                city: typedCity
                              }));
                            }
                          }}
                          placeholder={!formData.state ? 'Select state first' : 'Type to search...'}
                          disabled={!formData.state}
                          className={`h-12 border-gray-300 focus:border-venue-indigo focus:ring-venue-indigo ${!formData.state ? 'opacity-50' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Row 4: Password and Confirm Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password (minimum 8 characters with uppercase, lowercase, numbers, and special characters)"
                            className="pl-10 pr-10 h-12 border-gray-300 focus:border-venue-indigo focus:ring-venue-indigo"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            className="pl-10 pr-10 h-12 border-gray-300 focus:border-venue-indigo focus:ring-venue-indigo"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}

                    {/* Terms Agreement */}
                    <div className="flex items-start space-x-3">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        required
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-venue-indigo focus:ring-venue-indigo border-gray-300 rounded cursor-pointer"
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                        I agree to the{' '}
                        <Link to="#" className="text-venue-indigo hover:text-venue-purple font-medium underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="#" className="text-venue-indigo hover:text-venue-purple font-medium underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    {/* Create Account Button */}
                    <div className="flex justify-center sm:justify-start">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-8 h-12 bg-venue-indigo hover:bg-[#5a6549] text-white font-medium text-base disabled:opacity-50 transition-colors"
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
