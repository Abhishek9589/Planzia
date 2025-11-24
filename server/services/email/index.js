// Barrel export - re-export all email template functions for backward compatibility

export { sendOTPEmail } from './templates/otp.js';
export { sendVenueInquiryEmail } from './templates/venueInquiry.js';
export { sendInquiryNotificationToPlanzia } from './templates/inquiryNotification.js';
export { sendInquiryAcceptedToCustomer } from './templates/inquiryAcceptedCustomer.js';
export { sendInquiryAcceptedToAdmin } from './templates/inquiryAcceptedAdmin.js';
export { sendInquiryRejectedToCustomer } from './templates/inquiryRejectedCustomer.js';
export { sendInquiryRejectedToAdmin } from './templates/inquiryRejectedAdmin.js';
export { sendBookingCancellationEmail } from './templates/bookingCancellation.js';
export { sendPaymentNotCompletedEmail } from './templates/paymentNotCompleted.js';
export { sendPaymentCompletedEmail } from './templates/paymentCompleted.js';
export { sendPaymentReminderEmail } from './templates/paymentReminder.js';
