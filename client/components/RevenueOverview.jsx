import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import apiClient from '../lib/apiClient';
import { toast } from '@/components/ui/use-toast';

const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export default function RevenueOverview() {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    loadRevenue();
  }, []);

  const loadRevenue = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getJson('/api/bookings/owner/revenue-summary?period=' + period);
      setRevenue(data);
    } catch (error) {
      console.error('Error loading revenue:', error);
      toast({
        title: 'Error',
        description: 'Failed to load revenue data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-venue-purple" />
      </div>
    );
  }

  if (!revenue) {
    return null;
  }

  const { summary, recentBookings } = revenue;

  return (
    <div className="space-y-6">
      {/* Revenue Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={transition}
      >
        {/* Total Revenue */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-venue-dark">
              ₹{(summary.totalRevenue || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Last {summary.period}
            </p>
          </CardContent>
        </Card>

        {/* Confirmed Bookings */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              Confirmed Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-venue-dark">
              {summary.confirmedBookings}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Paid bookings
            </p>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-venue-dark">
              {summary.pendingBookings}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Awaiting payment
            </p>
          </CardContent>
        </Card>

        {/* Pending Amount */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Pending Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-venue-dark">
              ₹{(summary.pendingAmount || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              To be collected
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Revenue Breakdown */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={transition}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-venue-purple" />
              Revenue Details
            </CardTitle>
            <CardDescription>
              Complete breakdown of your revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Base Price (Before GST)</p>
                  <p className="text-2xl font-bold text-venue-dark">
                    ₹{(summary.basePrice || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">GST (18%)</p>
                  <p className="text-2xl font-bold text-venue-dark">
                    ₹{(summary.gstAmount || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Bookings */}
      {recentBookings && recentBookings.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={transition}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Confirmed Bookings</CardTitle>
              <CardDescription>
                Your latest payments and bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBookings.map((booking, idx) => (
                  <motion.div
                    key={booking._id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ ...transition, delay: idx * 0.05 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-venue-dark">
                          {booking.customer_name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Event Date: {new Date(booking.event_date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          Paid: {new Date(booking.payment_completed_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-2">
                          ✓ Paid
                        </Badge>
                        <p className="text-lg font-bold text-venue-dark">
                          ₹{(booking.amount || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={loadRevenue}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
    </div>
  );
}
