import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Venue from '../models/Venue.js';
import { formatScheduleWithTimes, calculatePriceBreakdown, generatePriceBreakupHTML } from './email/utils/emailHelpers.js';
import transporter from './email/transporter.js';

let jobInterval = null;

export async function startBookingCleanupJob() {
  console.log('Starting booking cleanup job...');

  if (jobInterval) {
    clearInterval(jobInterval);
  }

  jobInterval = setInterval(async () => {
    try {
      await processExpiredPayments();
    } catch (error) {
      console.error('Error in booking cleanup job:', error);
    }
  }, 60 * 60 * 1000);

  console.log('Booking cleanup job started (runs every hour)');
}

export async function stopBookingCleanupJob() {
  if (jobInterval) {
    clearInterval(jobInterval);
    jobInterval = null;
    console.log('Booking cleanup job stopped');
  }
}

async function processExpiredPayments() {
  try {
    const now = new Date();

    // Find bookings that are confirmed but payment pending and deadline has passed
    const expiredBookings = await Booking.find({
      status: 'confirmed',
      payment_status: 'pending',
      payment_deadline: { $lt: now }
    }).lean();

    if (expiredBookings.length === 0) {
      return;
    }

    console.log(`Found ${expiredBookings.length} expired unpaid bookings`);

    for (const booking of expiredBookings) {
      try {
        await Booking.updateOne(
          { _id: booking._id },
          {
            $set: {
              status: 'cancelled',
              payment_status: 'failed',
              cancellation_reason: 'Payment not completed within 24 hours'
            }
          }
        );

        const customer = await User.findById(booking.customer_id, {
          name: 1,
          email: 1
        }).lean();

        const venue = await Venue.findById(booking.venue_id, {
          name: 1,
          location: 1,
          owner_id: 1,
          price_per_day: 1
        }).lean();

        // Send cancellation email to customer
        if (customer && customer.email && venue) {
          try {
            const mailOptions = {
              from: {
                name: 'Planzia',
                address: process.env.EMAIL_USER
              },
              to: customer.email,
              subject: `Booking Cancelled - Payment Deadline Expired`,
              html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Booking Cancelled</title>
                  <style>
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                    h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                  </style>
                </head>
                <body style="margin: 0; padding: 40px 20px; background-color: #ffffff; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                  <table role="presentation" width="100%" style="max-width: 600px; margin: 0 auto; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 0;">
                        <h1 style="color: #1a1a1a; margin: 0 0 32px 0; font-size: 18px; font-weight: 400; line-height: 1.4; text-align: center;">
                          Booking <strong>Cancelled</strong>
                        </h1>

                        <div style="border: 1px solid #f56565; border-radius: 6px; padding: 20px; margin: 0 0 32px 0; background-color: #fff5f5;">
                          <p style="color: #742a2a; margin: 0 0 12px 0; font-size: 14px; font-weight: 400; line-height: 1.6;">
                            Your booking at <strong>${venue.name}</strong> has been automatically cancelled because payment was not completed within the 24-hour deadline.
                          </p>
                        </div>

                        <div style="background-color: #f6f8fa; border-radius: 6px; padding: 20px; margin: 0 0 32px 0;">
                          <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Booking Details:</p>
                          <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 8px 0; color: #424a52; font-size: 13px;">Booking ID:</td>
                              <td style="padding: 8px 0; color: #1a1a1a; font-weight: 600; text-align: right;">#${booking._id}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #424a52; font-size: 13px;">Venue:</td>
                              <td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${venue.name}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #424a52; font-size: 13px;">Event Date:</td>
                              <td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${new Date(booking.event_date).toLocaleDateString('en-IN')}</td>
                            </tr>
                          </table>
                        </div>

                        <div style="text-align: center; margin: 0 0 32px 0;">
                          <p style="color: #666666; margin: 0 0 12px 0; font-size: 13px;">
                            To rebook this venue or select an alternative, please visit our platform:
                          </p>
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/venues" style="display: inline-block; background-color: #ed8936; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                            Browse Venues
                          </a>
                        </div>

                        <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                          Thanks,
                        </p>
                        <p style="color: #1a1a1a; margin: 0 0 32px 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                          The Planzia Team
                        </p>

                        <p style="color: #666666; margin: 0; font-size: 12px; font-weight: 400; line-height: 1.6;">
                          If you have any questions, please reply to this email or contact our support team.
                        </p>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
              `
            };
            await transporter.sendMail(mailOptions);
            console.log(`Cancellation email sent to ${customer.email} for booking ${booking._id}`);
          } catch (emailError) {
            console.error(`Error sending cancellation email for booking ${booking._id}:`, emailError);
          }
        }

        console.log(
          `Cancelled booking ${booking._id} due to expired payment deadline`
        );
      } catch (error) {
        console.error(`Error processing expired booking ${booking._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in processExpiredPayments:', error);
  }
}

export async function triggerPaymentReminderForBooking(bookingId) {
  try {
    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return { success: false, message: 'Booking not found' };
    }

    const customer = await User.findById(booking.customer_id).lean();
    if (!customer || !customer.email) {
      return { success: false, message: 'Customer email not found' };
    }

    const venue = await Venue.findById(booking.venue_id).lean();
    if (!venue) {
      return { success: false, message: 'Venue not found' };
    }

    const mailOptions = {
      from: {
        name: 'Planzia',
        address: process.env.EMAIL_USER
      },
      to: customer.email,
      subject: `Payment Reminder - Complete Your Booking #${booking._id}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Reminder</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Momo+Trust+Display&family=Outfit:wght@100..900&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
          </style>
        </head>
        <body style="margin: 0; padding: 40px 20px; background-color: #ffffff; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <table role="presentation" width="100%" style="max-width: 600px; margin: 0 auto; border-collapse: collapse;">
            <tr>
              <td style="padding: 0;">
                <h1 style="color: #1a1a1a; margin: 0 0 32px 0; font-size: 18px; font-weight: 400; line-height: 1.4; text-align: center;">
                  Payment Reminder - Complete Your <strong>Booking</strong>
                </h1>

                <div style="border: 1px solid #f6e05e; border-radius: 6px; padding: 20px; margin: 0 0 32px 0; background-color: #fffbea;">
                  <p style="color: #744210; margin: 0 0 12px 0; font-size: 14px; font-weight: 400; line-height: 1.6;">
                    We noticed that you haven't completed the payment for your booking at <strong>${venue.name}</strong>. Please complete the payment to confirm your reservation.
                  </p>
                </div>

                <div style="background-color: #f6f8fa; border-radius: 6px; padding: 20px; margin: 0 0 32px 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Booking Details:</p>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #424a52; font-size: 13px;">Booking ID:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-weight: 600; text-align: right;">#${booking._id}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #424a52; font-size: 13px;">Venue:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${venue.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #424a52; font-size: 13px;">Event Date:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${new Date(booking.event_date).toLocaleDateString()}</td>
                    </tr>
                    <tr style="background-color: #e6f3ff; border-top: 1px solid #38b2ac;">
                      <td style="padding: 12px 0; color: #0c5460; font-weight: 600;">Amount Due:</td>
                      <td style="padding: 12px 0; color: #0c5460; font-weight: 700; text-align: right; font-size: 18px;">₹${booking.amount || 'Contact venue for pricing'}</td>
                    </tr>
                  </table>
                </div>

                <div style="text-align: center; margin: 0 0 32px 0;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/bookings/${booking._id}" style="display: inline-block; background-color: #ed8936; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                    Complete Payment
                  </a>
                </div>

                <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                  Thanks,
                </p>
                <p style="color: #1a1a1a; margin: 0 0 32px 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                  The Planzia Team
                </p>

                <p style="color: #666666; margin: 0; font-size: 12px; font-weight: 400; line-height: 1.6;">
                  If you have any questions, please reply to this email or contact our support team.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Payment reminder sent to ${customer.email} for booking ${bookingId}`);
    return { success: true, message: 'Payment reminder sent successfully' };
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    return { success: false, message: 'Failed to send payment reminder', error: error.message };
  }
}
