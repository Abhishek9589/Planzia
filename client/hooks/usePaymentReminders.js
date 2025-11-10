import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';

export function usePaymentReminders(bookings = []) {
  const [pendingPaymentBookings, setPendingPaymentBookings] = useState([]);
  const [expiredBookings, setExpiredBookings] = useState([]);

  useEffect(() => {
    if (!Array.isArray(bookings)) {
      return;
    }

    const now = new Date();
    const pending = [];
    const expired = [];

    bookings.forEach((booking) => {
      if (
        booking.status === 'pending' &&
        booking.payment_status === 'pending' &&
        booking.payment_deadline
      ) {
        const deadline = new Date(booking.payment_deadline);
        const hoursRemaining = (deadline - now) / (1000 * 60 * 60);

        if (hoursRemaining > 0) {
          pending.push({
            ...booking,
            hoursRemaining: Math.ceil(hoursRemaining),
            isExpiring: hoursRemaining <= 3
          });
        } else {
          expired.push(booking);
        }
      }
    });

    setPendingPaymentBookings(pending.sort((a, b) => a.hoursRemaining - b.hoursRemaining));
    setExpiredBookings(expired);
  }, [bookings]);

  const getUrgentCount = useCallback(() => {
    return pendingPaymentBookings.filter((b) => b.isExpiring).length + expiredBookings.length;
  }, [pendingPaymentBookings, expiredBookings]);

  const getTotalPendingAmount = useCallback(() => {
    return pendingPaymentBookings.reduce((sum, booking) => {
      return sum + (booking.payment_amount || booking.amount || 0);
    }, 0);
  }, [pendingPaymentBookings]);

  return {
    pendingPaymentBookings,
    expiredBookings,
    urgentCount: getUrgentCount(),
    totalPendingAmount: getTotalPendingAmount(),
    hasPendingPayments: pendingPaymentBookings.length > 0 || expiredBookings.length > 0
  };
}
