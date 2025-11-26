import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle, ArrowLeft, RotateCw } from 'lucide-react';
import { getUserFriendlyError } from '../lib/errorMessages';
import { motion } from 'framer-motion';
import apiClient from '../lib/apiClient';
import { safeNavigateBack } from '@/lib/navigationUtils';

const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const otpRefs = useRef({});

  const { forgotPassword, resetPassword } = useAuth();

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await forgotPassword(email);
      setSuccess(true);
      setCurrentStep(2);
      toast({
        title: 'Code Sent',
        description: 'A verification code has been sent to your email'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMsg = error?.response?.data?.error || error.message || '';
      const lowerCaseError = errorMsg.toLowerCase();

      if (lowerCaseError.includes('email') && (lowerCaseError.includes('not found') || lowerCaseError.includes("doesn't exist"))) {
        setError('⚠️ No account found with this email address.');
      } else if (lowerCaseError.includes('rate') || lowerCaseError.includes('too many')) {
        setError('🔒 Too many requests. Please wait a few minutes before trying again.');
      } else {
        setError(getUserFriendlyError(error, 'password-reset') || 'Unable to send reset code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpDigitChange = (index, value) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue.length > 1) {
      // If pasted multiple digits, fill remaining fields
      const newDigits = [...otpDigits];
      for (let i = index; i < 8 && i - index < numericValue.length; i++) {
        newDigits[i] = numericValue[i - index];
      }
      setOtpDigits(newDigits);

      // Focus on next empty field or last field
      const nextIndex = Math.min(index + numericValue.length, 7);
      if (otpRefs.current[nextIndex]) {
        setTimeout(() => otpRefs.current[nextIndex]?.focus(), 0);
      }
    } else {
      const newDigits = [...otpDigits];
      newDigits[index] = numericValue;
      setOtpDigits(newDigits);

      // Auto-focus next field if digit was entered
      if (numericValue && index < 7) {
        setTimeout(() => otpRefs.current[index + 1]?.focus(), 0);
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const newDigits = [...otpDigits];
      if (otpDigits[index]) {
        // Clear current field
        newDigits[index] = '';
        setOtpDigits(newDigits);
      } else if (index > 0) {
        // Move to previous field and clear it
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        setTimeout(() => otpRefs.current[index - 1]?.focus(), 0);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 7) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const otp = otpDigits.join('');
    if (!otp || otp.length !== 8) {
      setError('Please enter all 8 digits of your verification code.');
      setIsLoading(false);
      return;
    }

    try {
      // Verify OTP with server
      await apiClient.postJson('/api/auth/verify-otp-for-password-reset', {
        email,
        otp
      });

      // OTP is valid, proceed to password reset
      setVerifiedOtp(otp);
      setCurrentStep(3);
      setSuccess(false);
      setError('');
      setResendCooldown(0); // Reset cooldown when code is verified
      toast({
        title: 'Code Verified',
        description: 'Your verification code is valid. Please enter your new password.'
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMsg = error?.response?.data?.error || error.message || '';
      const lowerCaseError = errorMsg.toLowerCase();

      // Handle specific error cases with user-friendly messages
      if (lowerCaseError.includes('expired') || lowerCaseError.includes('timeout')) {
        setError('⏱️ Your verification code has expired. Please request a new one and try again.');
      } else if (lowerCaseError.includes('invalid') || lowerCaseError.includes('incorrect') || lowerCaseError.includes('wrong')) {
        setError('❌ The code you entered is incorrect. Please double-check and try again.');
      } else if (lowerCaseError.includes('too many') || lowerCaseError.includes('too many attempts')) {
        setError('🔒 Too many incorrect attempts. Please request a new code and try again.');
      } else if (lowerCaseError.includes('not found')) {
        setError('⚠️ Verification code not found. Please request a new one.');
      } else {
        setError(getUserFriendlyError(error, 'otp') || 'Unable to verify the code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    setError('');

    try {
      await forgotPassword(email);
      setSuccess(true);
      setOtpDigits(['', '', '', '', '', '', '', '']);
      setResendCooldown(60); // 60 second cooldown
      otpRefs.current[0]?.focus();
      toast({
        title: 'Code Resent',
        description: 'A new verification code has been sent to your email'
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
      const errorMsg = error?.response?.data?.error || error.message || '';
      const lowerCaseError = errorMsg.toLowerCase();

      if (lowerCaseError.includes('rate') || lowerCaseError.includes('too many')) {
        setError('🔒 Too many requests. Please wait a few minutes before trying again.');
      } else if (lowerCaseError.includes('email')) {
        setError('⚠️ Unable to resend code. Please check your email address.');
      } else {
        setError(getUserFriendlyError(error, 'password-reset') || 'Unable to resend the code. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  const validateNewPassword = (password) => {
    // Minimum 8 characters with uppercase, lowercase, special characters, and numbers
    if (password.length < 8) return false;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(password);
    return hasUppercase && hasLowercase && hasNumbers && hasSpecialChar;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!newPassword.trim()) {
      setError('Please enter a new password.');
      setIsLoading(false);
      return;
    }

    if (!validateNewPassword(newPassword)) {
      setError('Password must be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and special characters.');
      setIsLoading(false);
      return;
    }

    if (!confirmPassword.trim()) {
      setError('Please confirm your new password.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('⚠️ The passwords you entered do not match. Please check and try again.');
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(email, verifiedOtp, newPassword);
      setSuccess(true);
      setCurrentStep(4);
      setError('');
      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been successfully reset. Please sign in with your new password.'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMsg = error?.response?.data?.error || error.message || '';
      const lowerCaseError = errorMsg.toLowerCase();

      if (lowerCaseError.includes('expired') || lowerCaseError.includes('invalid')) {
        setError('⏱️ Your verification session has expired. Please start over.');
      } else if (lowerCaseError.includes('password') && (lowerCaseError.includes('8 characters') || lowerCaseError.includes('uppercase'))) {
        setError('Password must be at least 8 characters long with uppercase letters, lowercase letters, numbers, and special characters.');
      } else {
        setError(getUserFriendlyError(error, 'password-reset') || 'Unable to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === 4 && success) {
    return (
      <div className="min-h-screen bg-white/70 backdrop-blur-lg flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 pt-16">
        <motion.div
          className="w-full max-w-md"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={transition}
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-venue-dark">
                Password Reset Successful
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your password has been successfully reset
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  You can now sign in with your new password.
                </p>
                <Button
                  className="w-full h-11 bg-venue-indigo hover:bg-[#5a6549] text-white font-medium"
                  onClick={() => safeNavigateBack(navigate, '/signin')}
                >
                  Return to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white/70 backdrop-blur-lg flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 pt-16">
      <motion.div
        className="w-full max-w-md"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={transition}
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-venue-dark">
              {currentStep === 1 ? 'Forgot Password?' :
               currentStep === 2 ? 'Verify Code' : 'Reset Your Password'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {currentStep === 1
                ? 'Enter your email address and we\'ll send you a verification code to reset your password'
                : currentStep === 2
                ? 'Enter the 8-digit verification code sent to your email'
                : 'Enter your new password'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && currentStep === 2 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Verification code sent to {email}
                </AlertDescription>
              </Alert>
            )}

            {currentStep === 1 && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-venue-indigo hover:bg-[#5a6549] text-white font-medium"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Code'}
                </Button>
              </form>
            )}

            {currentStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Verification Code
                  </Label>
                  <div className="flex gap-2 justify-center">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          if (el) otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        placeholder="0"
                        className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-venue-indigo focus:outline-none focus:ring-2 focus:ring-venue-indigo focus:ring-offset-0 transition-colors"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Enter the 8-digit code sent to your email
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otpDigits.join('').length !== 8}
                  className="w-full h-11 bg-venue-indigo hover:bg-[#5a6549] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Button>

                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                    <Button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || resendLoading || isLoading}
                      variant="ghost"
                      className="text-venue-indigo hover:text-venue-purple hover:bg-transparent disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <RotateCw className={`h-4 w-4 mr-2 ${resendLoading ? 'animate-spin' : ''}`} />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : resendLoading ? 'Sending...' : 'Resend Code'}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {currentStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password (minimum 8 characters with uppercase, lowercase, numbers, and special characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-venue-indigo hover:bg-[#5a6549] text-white font-medium"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}

            <div className="text-center">
              <Button
                variant="ghost"
                className="text-venue-purple hover:text-venue-indigo inline-flex items-center"
                onClick={() => safeNavigateBack(navigate, '/signin')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
