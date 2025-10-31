import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Notification } from '@/components/ui/notification';
import { ChevronRight, Trash2, Clock, MapPin, Users, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export default function MultiDayBookingModal({
  open,
  onOpenChange,
  venue,
  user,
  onSubmit,
  isSubmitting
}) {
  const [step, setStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateTimings, setDateTimings] = useState({});
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
    specialRequests: ''
  });
  const [notification, setNotification] = useState(null);
  const [editingDateIndex, setEditingDateIndex] = useState(null);

  useEffect(() => {
    if (open) {
      setBookingForm(prev => ({
        fullName: user?.full_name || user?.name || '',
        email: user?.email || '',
        phone: user?.mobileNumber || '',
        eventType: prev.eventType || '',
        guestCount: prev.guestCount || '',
        specialRequests: prev.specialRequests || ''
      }));
      const today = new Date();
      setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    } else {
      // Reset form when modal closes
      setStep(1);
      setSelectedDates([]);
      setDateTimings({});
    }
  }, [open, user]);

  const handleDateSelect = (dates) => {
    if (!dates || dates.length === 0) {
      setSelectedDates([]);
      setDateTimings({});
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateStrings = dates
      .map(date => {
        if (date instanceof Date) {
          // Convert Date to local YYYY-MM-DD string
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        return date;
      })
      .map(dateStr => {
        const [year, month, day] = dateStr.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      })
      .filter(date => {
        date.setHours(0, 0, 0, 0);
        return date > today;
      })
      .map(date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      });

    setSelectedDates(dateStrings);

    const updatedTimings = { ...dateTimings };

    // Initialize timing for new dates
    dateStrings.forEach(dateStr => {
      if (!updatedTimings[dateStr]) {
        updatedTimings[dateStr] = {
          timeFromHour: '',
          timeFromMinute: '',
          timeFromPeriod: 'AM',
          timeToHour: '',
          timeToMinute: '',
          timeToPeriod: 'AM'
        };
      }
    });

    // Remove timings for deselected dates
    Object.keys(updatedTimings).forEach(dateStr => {
      if (!dateStrings.includes(dateStr)) {
        delete updatedTimings[dateStr];
      }
    });

    setDateTimings(updatedTimings);
  };

  const handleRemoveDate = (dateStr) => {
    const newDates = selectedDates.filter(d => d !== dateStr);
    setSelectedDates(newDates);

    const updatedTimings = { ...dateTimings };
    delete updatedTimings[dateStr];
    setDateTimings(updatedTimings);
  };

  const handleTimingChange = (dateStr, field, value) => {
    setDateTimings(prev => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [field]: value
      }
    }));
  };

  const allDatesHaveTimings = selectedDates.every(dateStr => {
    const timing = dateTimings[dateStr];
    return timing && timing.timeFromHour && timing.timeFromMinute && timing.timeToHour && timing.timeToMinute;
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (selectedDates.length === 0) {
        setNotification({
          type: 'error',
          message: 'Please select at least one date'
        });
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!allDatesHaveTimings) {
        setNotification({
          type: 'error',
          message: 'Please select timing for all selected dates'
        });
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!bookingForm.fullName || !bookingForm.email || !bookingForm.phone || !bookingForm.eventType || !bookingForm.guestCount) {
        setNotification({
          type: 'error',
          message: 'Please fill in all required fields'
        });
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setNotification(null);
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setNotification(null);
    setStep(step - 1);
  };

  const calculatePricing = () => {
    const totalDays = selectedDates.length;
    const pricePerDay = parseFloat(venue.price_per_day || venue.price || 0);
    const baseCost = pricePerDay * totalDays;
    const platformFee = baseCost * 0.10;
    const gst = (baseCost + platformFee) * 0.18;
    const grandTotal = baseCost + platformFee + gst;

    return {
      totalDays,
      pricePerDay,
      baseCost,
      platformFee,
      gst,
      grandTotal
    };
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const pricing = calculatePricing();

    // Ensure all date/time values are properly formatted
    const dates_timings = selectedDates.map(dateStr => {
      const timing = dateTimings[dateStr] || {};
      return {
        date: dateStr,
        timing: {
          timeFromHour: String(timing.timeFromHour || '').trim(),
          timeFromMinute: String(timing.timeFromMinute || '').padStart(2, '0'),
          timeFromPeriod: String(timing.timeFromPeriod || 'AM').toUpperCase(),
          timeToHour: String(timing.timeToHour || '').trim(),
          timeToMinute: String(timing.timeToMinute || '').padStart(2, '0'),
          timeToPeriod: String(timing.timeToPeriod || 'AM').toUpperCase()
        }
      };
    });

    const bookingData = {
      venue_id: venue.id,
      venue_name: venue.name,
      user_details: {
        ...bookingForm,
        guestCount: parseInt(bookingForm.guestCount) || 0
      },
      dates_timings,
      pricing,
      inquiry_date: new Date().toISOString()
    };

    await onSubmit(bookingData);
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const pricing = calculatePricing();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Step 1: Select Dates */}
        {step === 1 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <DialogHeader>
              <DialogTitle>Select Event Dates</DialogTitle>
              <DialogDescription>
                Choose one or more dates for your event
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4">
              <div className="flex justify-center">
                <Calendar
                  mode="multiple"
                  selected={selectedDates.map(d => {
                    const [year, month, day] = d.split('-');
                    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                  })}
                  onSelect={handleDateSelect}
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
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Selected dates: <span className="font-semibold">{selectedDates.length}</span>
                </p>
              </div>

              {selectedDates.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Selected Dates:</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDates.sort().map(dateStr => (
                      <div
                        key={dateStr}
                        className="bg-venue-indigo/10 text-venue-indigo px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {formatDate(dateStr)}
                        <button
                          onClick={() => handleRemoveDate(dateStr)}
                          className="hover:text-red-500 transition-colors"
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 flex-col sm:flex-row">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={selectedDates.length === 0}
                className="bg-venue-indigo hover:bg-venue-purple"
              >
                Next: Select Timings <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </DialogFooter>
          </motion.div>
        )}

        {/* Step 2: Select Timings for Each Date */}
        {step === 2 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <DialogHeader>
              <DialogTitle>Select Timing for Each Date</DialogTitle>
              <DialogDescription>
                Choose start and end times for each selected date
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6 max-h-96 overflow-y-auto">
              {selectedDates.sort().map((dateStr, index) => {
                const timing = dateTimings[dateStr] || {
                  timeFromHour: '',
                  timeFromMinute: '',
                  timeFromPeriod: 'AM',
                  timeToHour: '',
                  timeToMinute: '',
                  timeToPeriod: 'AM'
                };

                return (
                  <Card key={dateStr} className="border-l-4 border-l-venue-indigo">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {formatDate(dateStr)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">From Time</label>
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <Input
                                type="number"
                                min="1"
                                max="12"
                                placeholder="HH"
                                value={timing.timeFromHour}
                                onChange={(e) => handleTimingChange(dateStr, 'timeFromHour', e.target.value)}
                                className="text-center"
                              />
                            </div>
                            <span className="text-gray-500">:</span>
                            <div className="flex-1">
                              <Input
                                type="number"
                                min="0"
                                max="59"
                                placeholder="MM"
                                value={timing.timeFromMinute}
                                onChange={(e) => handleTimingChange(dateStr, 'timeFromMinute', e.target.value)}
                                className="text-center"
                              />
                            </div>
                            <select
                              value={timing.timeFromPeriod}
                              onChange={(e) => handleTimingChange(dateStr, 'timeFromPeriod', e.target.value)}
                              className="px-2 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option>AM</option>
                              <option>PM</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">To Time</label>
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <Input
                                type="number"
                                min="1"
                                max="12"
                                placeholder="HH"
                                value={timing.timeToHour}
                                onChange={(e) => handleTimingChange(dateStr, 'timeToHour', e.target.value)}
                                className="text-center"
                              />
                            </div>
                            <span className="text-gray-500">:</span>
                            <div className="flex-1">
                              <Input
                                type="number"
                                min="0"
                                max="59"
                                placeholder="MM"
                                value={timing.timeToMinute}
                                onChange={(e) => handleTimingChange(dateStr, 'timeToMinute', e.target.value)}
                                className="text-center"
                              />
                            </div>
                            <select
                              value={timing.timeToPeriod}
                              onChange={(e) => handleTimingChange(dateStr, 'timeToPeriod', e.target.value)}
                              className="px-2 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option>AM</option>
                              <option>PM</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <DialogFooter className="gap-2 flex-col sm:flex-row mt-6">
              <Button
                variant="outline"
                onClick={handlePrevStep}
              >
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!allDatesHaveTimings}
                className="bg-venue-indigo hover:bg-venue-purple"
              >
                Next: Review Summary <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </DialogFooter>
          </motion.div>
        )}

        {/* Step 3: User Details */}
        {step === 3 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <DialogHeader>
              <DialogTitle>Your Details</DialogTitle>
              <DialogDescription>
                Provide your contact information and event details
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold">Locked</span>
                </div>
                <Input
                  id="fullName"
                  name="fullName"
                  value={bookingForm.fullName}
                  onChange={handleFormChange}
                  placeholder="Your full name"
                  required
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold">Locked</span>
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={bookingForm.email}
                  onChange={handleFormChange}
                  placeholder="your@email.com"
                  required
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold">Locked</span>
                </div>
                <Input
                  id="phone"
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleFormChange}
                  placeholder="+91 00000 00000"
                  required
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-sm font-medium">Event Type *</Label>
                <Input
                  id="eventType"
                  name="eventType"
                  value={bookingForm.eventType}
                  onChange={handleFormChange}
                  placeholder="e.g., Wedding, Corporate, Birthday"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestCount" className="text-sm font-medium">Guest Count *</Label>
                <Input
                  id="guestCount"
                  name="guestCount"
                  type="number"
                  value={bookingForm.guestCount}
                  onChange={handleFormChange}
                  placeholder="Number of guests"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests" className="text-sm font-medium">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={bookingForm.specialRequests}
                  onChange={handleFormChange}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 flex-col sm:flex-row mt-6">
              <Button
                variant="outline"
                onClick={handlePrevStep}
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                className="bg-venue-indigo hover:bg-venue-purple"
              >
                Next: Review Summary <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </DialogFooter>
          </motion.div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <DialogHeader>
              <DialogTitle>Booking Summary</DialogTitle>
              <DialogDescription>
                Review your booking details before confirming
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6 max-h-96 overflow-y-auto">
              {/* Venue Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{venue.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {venue.location || 'Location not specified'}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    {bookingForm.guestCount} guests
                  </div>
                </CardContent>
              </Card>

              {/* Selected Dates & Timings */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Selected Dates & Timings:</h4>
                <div className="space-y-2">
                  {selectedDates.sort().map(dateStr => {
                    const timing = dateTimings[dateStr];
                    return (
                      <div key={dateStr} className="bg-gray-50 p-3 rounded-lg text-sm">
                        <p className="font-medium text-gray-900">{formatDate(dateStr)}</p>
                        <p className="text-gray-600">
                          {timing.timeFromHour}:{timing.timeFromMinute.padStart(2, '0')} {timing.timeFromPeriod} - {timing.timeToHour}:{timing.timeToMinute.padStart(2, '0')} {timing.timeToPeriod}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Pricing Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per day</span>
                    <span className="font-medium">₹{pricing.pricePerDay.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total days</span>
                    <span className="font-medium">{pricing.totalDays}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-sm">
                    <span className="text-gray-600">Venue Cost</span>
                    <span className="font-medium">₹{pricing.baseCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee (10%)</span>
                    <span className="font-medium">₹{pricing.platformFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-medium">₹{pricing.gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-venue-indigo">₹{pricing.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="gap-2 flex-col sm:flex-row mt-6">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-venue-indigo hover:bg-venue-purple"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Sending Inquiry...
                  </>
                ) : (
                  'Send Inquiry'
                )}
              </Button>
            </DialogFooter>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
