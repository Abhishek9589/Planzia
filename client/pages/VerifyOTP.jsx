import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { getUserFriendlyError } from '../lib/errorMessages';
import { AlertCircle, CheckCircle, ArrowLeft, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { safeNavigateBack } from '@/lib/navigationUtils';

const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export default function VerifyOTP() {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const otpRefs = useRef({});

  const email = location.state?.email || 'your@email.com';

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otpDigits.join('');

    if (otpCode.length !== 8) {
      setError('Please enter the complete 8-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOTP(email, otpCode);
      setSuccess('Verification successful!');
      toast({
        title: 'Welcome to Planzia!',
        description: 'Your account has been successfully verified and created.'
      });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(getUserFriendlyError(err, 'otp'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      await resendOTP(email);
      setOtpDigits(['', '', '', '', '', '', '', '']);
      setResendCooldown(60); // 60 second cooldown
      otpRefs.current[0]?.focus();
      setSuccess('New verification code sent to your email');
      toast({
        title: 'Code Sent',
        description: 'New verification code sent to your email'
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(getUserFriendlyError(err, 'otp'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white/70 backdrop-blur-lg flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 pt-16">
      <motion.div
        className="w-full max-w-lg"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={transition}
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-venue-dark">
              Verify Code
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter the 8-digit verification code sent to your email
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

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
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
                  Enter the 8-digit code sent to {email}
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 8}
                className="w-full h-11 bg-venue-indigo hover:bg-[#5a6549] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                  <Button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || resendLoading || loading}
                    variant="ghost"
                    className="text-venue-indigo hover:text-venue-purple hover:bg-transparent disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <RotateCw className={`h-4 w-4 mr-2 ${resendLoading ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : resendLoading ? 'Sending...' : 'Resend Code'}
                  </Button>
                </div>
              </div>
            </form>

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
