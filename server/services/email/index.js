// Barrel export - re-export all email template functions for backward compatibility

export { sendOTPEmail } from './templates/otp.js';
export { sendVenueInquiryEmail } from './templates/venueInquiry.js';
export { sendInquiryNotificationToPlanzia } from './templates/inquiryNotification.js';
export { sendInquiryAcceptedToCustomer } from './templates/inquiryAcceptedCustomer.js';
export { sendInquiryRejectedToCustomer } from './templates/inquiryRejectedCustomer.js';
export { sendPaymentCompletedEmail, sendPaymentCompletedAdminEmail } from './templates/paymentCompleted.js';
