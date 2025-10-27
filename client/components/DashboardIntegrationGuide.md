# Booking and Payment Flow Components - Integration Guide

This document describes how to integrate the new payment and booking flow components into your application.

## Components Overview

### 1. RevenueOverview Component
**Path:** `client/components/RevenueOverview.jsx`

Used on venue owner dashboards to display revenue metrics and statistics.

#### Props:
- None (data fetched from API)

#### Usage:
```jsx
import RevenueOverview from '@/components/RevenueOverview';

export default function VenueOwnerDashboard() {
  return (
    <div>
      <RevenueOverview />
    </div>
  );
}
```

#### Features:
- Total revenue display (18% GST included)
- Confirmed bookings count
- Pending payments count
- Pending amount to be collected
- Recent confirmed bookings list
- Manual refresh button

---

### 2. BookingPaymentStatus Component
**Path:** `client/components/BookingPaymentStatus.jsx`

Displays the payment status of a specific booking with action buttons.

#### Props:
```typescript
{
  booking: {
    _id: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    payment_status: 'pending' | 'completed' | 'failed';
    payment_deadline: Date;
    event_date: Date;
    cancellation_reason?: string;
  };
  onPaymentReminderSent?: () => void;
}
```

#### Usage:
```jsx
import BookingPaymentStatus from '@/components/BookingPaymentStatus';

export default function BookingCard({ booking }) {
  return (
    <BookingPaymentStatus
      booking={booking}
      onPaymentReminderSent={() => {
        // Handle reminder sent
        loadUserData();
      }}
    />
  );
}
```

#### Features:
- Payment status display with color coding
- Payment deadline countdown
- "Send Reminder" button for pending payments
- Warning for expired bookings
- Automatic status updates

---

### 3. RatingReminderModal Component
**Path:** `client/components/RatingReminderModal.jsx`

Modal dialog that appears after an event date to request a rating.

#### Props:
```typescript
{
  isOpen: boolean;
  booking: {
    _id: string;
    venue_name: string;
    event_date: Date;
  };
  onClose: () => void;
  onRatingClick?: (rating: number, booking: any) => void;
}
```

#### Usage:
```jsx
import RatingReminderModal from '@/components/RatingReminderModal';

export default function UserDashboard() {
  const [ratingBooking, setRatingBooking] = useState(null);

  const handleRatingSubmit = async (rating, booking) => {
    // Submit rating to API
    await apiClient.postJson(`/api/ratings/${booking._id}`, { rating });
  };

  return (
    <>
      <RatingReminderModal
        isOpen={!!ratingBooking}
        booking={ratingBooking}
        onClose={() => setRatingBooking(null)}
        onRatingClick={handleRatingSubmit}
      />
    </>
  );
}
```

#### Features:
- Interactive 5-star rating system
- Event details display
- Encouraging messaging
- "Maybe Later" option

---

### 4. PaymentReminderBanner Component
**Path:** `client/components/PaymentReminderBanner.jsx`

Sticky banner at the top of dashboard showing urgent payment reminders.

#### Props:
```typescript
{
  urgentCount: number;
  totalPendingAmount: number;
  mostUrgentBooking?: {
    venue_name: string;
    hoursRemaining: number;
  };
  onNavigateToPayment: () => void;
  onDismiss: () => void;
  isDismissed: boolean;
}
```

#### Usage:
```jsx
import PaymentReminderBanner from '@/components/PaymentReminderBanner';
import { usePaymentReminders } from '@/hooks/usePaymentReminders';

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  const { 
    pendingPaymentBookings, 
    urgentCount, 
    totalPendingAmount 
  } = usePaymentReminders(bookings);

  const mostUrgent = pendingPaymentBookings[0];

  return (
    <>
      <PaymentReminderBanner
        urgentCount={urgentCount}
        totalPendingAmount={totalPendingAmount}
        mostUrgentBooking={mostUrgent}
        onNavigateToPayment={() => {
          // Scroll to bookings or navigate
        }}
        onDismiss={() => setBannerDismissed(true)}
        isDismissed={bannerDismissed}
      />
    </>
  );
}
```

#### Features:
- Animated sticky banner
- Color coding (amber/orange/red based on urgency)
- Payment countdown timer
- Total pending amount display
- Dismissible option
- Direct "Pay Now" action

---

## Custom Hooks

### usePaymentReminders Hook
**Path:** `client/hooks/usePaymentReminders.js`

Analyzes bookings and identifies pending payments.

#### Usage:
```jsx
import { usePaymentReminders } from '@/hooks/usePaymentReminders';

const { 
  pendingPaymentBookings,  // Array of bookings awaiting payment
  expiredBookings,         // Array of expired unpaid bookings
  urgentCount,            // Count of urgent (expiring soon) payments
  totalPendingAmount,     // Total amount pending
  hasPendingPayments      // Boolean flag
} = usePaymentReminders(bookings);
```

---

### useRatingReminders Hook
**Path:** `client/hooks/usePaymentReminders.js`

Identifies bookings eligible for rating reminders.

#### Usage:
```jsx
import { useRatingReminders } from '@/hooks/usePaymentReminders';

const { 
  eligibleForRating,      // Array of bookings ready for rating
  hasRatingReminder       // Boolean flag
} = useRatingReminders(bookings);
```

---

## Complete Integration Example

### Updated UserDashboard.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePaymentReminders, useRatingReminders } from '@/hooks/usePaymentReminders';
import PaymentReminderBanner from '@/components/PaymentReminderBanner';
import BookingPaymentStatus from '@/components/BookingPaymentStatus';
import RatingReminderModal from '@/components/RatingReminderModal';
import apiClient from '../lib/apiClient';

export default function UserDashboard() {
  const { user, isLoggedIn } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [ratingBooking, setRatingBooking] = useState(null);

  const { 
    pendingPaymentBookings, 
    urgentCount, 
    totalPendingAmount 
  } = usePaymentReminders(bookings);

  const { eligibleForRating } = useRatingReminders(bookings);

  // Auto-show rating reminder for first eligible booking
  useEffect(() => {
    if (eligibleForRating.length > 0 && !ratingBooking) {
      setRatingBooking(eligibleForRating[0]);
    }
  }, [eligibleForRating, ratingBooking]);

  useEffect(() => {
    if (isLoggedIn) {
      loadUserData();
    }
  }, [isLoggedIn]);

  const loadUserData = async () => {
    try {
      const data = await apiClient.getJson('/api/bookings/customer');
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const handleRatingSubmit = async (rating, booking) => {
    try {
      await apiClient.postJson(`/api/ratings/${booking._id}`, { 
        rating,
        booking_id: booking._id
      });
      
      // Reload data to update rating_reminder_sent status
      loadUserData();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const mostUrgent = pendingPaymentBookings[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Payment Reminder Banner */}
      <PaymentReminderBanner
        urgentCount={urgentCount}
        totalPendingAmount={totalPendingAmount}
        mostUrgentBooking={mostUrgent}
        onNavigateToPayment={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDismiss={() => setBannerDismissed(true)}
        isDismissed={bannerDismissed}
      />

      {/* Rating Reminder Modal */}
      <RatingReminderModal
        isOpen={!!ratingBooking}
        booking={ratingBooking}
        onClose={() => setRatingBooking(null)}
        onRatingClick={handleRatingSubmit}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Existing dashboard content */}
        {bookings.map((booking) => (
          <div key={booking._id}>
            <BookingPaymentStatus
              booking={booking}
              onPaymentReminderSent={loadUserData}
            />
            {/* Rest of booking card content */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## API Endpoints

### Revenue Endpoints

**Get Total Revenue**
```
GET /api/bookings/owner/revenue
Returns: { totalRevenue, basePrice, gstAmount, totalBookings, currency }
```

**Get Revenue by Venue**
```
GET /api/bookings/owner/revenue-by-venue
Returns: Array of venue revenue data
```

**Get Revenue Summary**
```
GET /api/bookings/owner/revenue-summary?period=30
Returns: { summary, monthlyData, recentBookings }
```

### Booking Endpoints

**Get Customer Bookings with Filters**
```
GET /api/bookings/customer?status=pending&payment_status=pending
Query Parameters:
  - status: 'pending' | 'confirmed' | 'cancelled'
  - payment_status: 'pending' | 'completed' | 'failed'
```

**Get Owner Bookings with Filters**
```
GET /api/bookings/owner?status=confirmed&payment_status=completed
Query Parameters:
  - status: 'pending' | 'confirmed' | 'cancelled'
  - payment_status: 'pending' | 'completed' | 'failed'
```

**Send Payment Reminder**
```
POST /api/bookings/:id/send-payment-reminder
Returns: { success: boolean, message: string }
```

---

## Email Notifications

The system automatically sends emails at these stages:

1. **Booking Created** - "Pending Payment" status
2. **Payment Completed** - Booking confirmed (manual email via verified endpoint)
3. **Payment Reminder** - Via `/send-payment-reminder` endpoint
4. **Payment Not Completed** - Auto-sent after 24 hours (via cleanup job)
5. **Rating Reminder** - After event date passes (via cleanup job)

---

## Booking Status Flow

```
User Creates Booking
       ↓
Status: 'pending' | Payment Status: 'pending' | Deadline: +24 hours
       ↓
   [Two Paths]
   
Path 1: Payment Completed
   ↓
Status: 'confirmed' | Payment Status: 'completed'
   ↓
   (After event date)
   ↓
Rating Reminder Sent

Path 2: Payment Not Completed (After 24 hours)
   ↓
Status: 'cancelled' | Payment Status: 'failed'
   ↓
Cancellation Email Sent
```

---

## Configuration

### Payment Deadline
Currently set to 24 hours from booking creation. To modify:
- Edit `server/routes/bookings.js` line where `payment_deadline` is set
- Edit `server/routes/payments.js` line where payment deadline is set

### Cleanup Job Interval
Currently runs every hour. To modify:
- Edit `server/services/bookingCleanupJob.js` line with `setInterval`
- Default: `60 * 60 * 1000` (1 hour)

### Email Configuration
Configure in `.env`:
```
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=noreply@planzia.com
EMAIL_PASS=your_password
FRONTEND_URL=https://planzia.com
CLIENT_URL=http://localhost:8080
```
