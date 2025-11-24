import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Venue from '../models/Venue.js';
import {
  sendPaymentNotCompletedEmail,
  sendPaymentReminderEmail
} from './email/index.js';

let jobInterval = null;

export async function startBookingCleanupJob() {
  console.log('Starting booking cleanup job...');

  if (jobInterval) {
    clearInterval(jobInterval);
  }

  jobInterval = setInterval(async () => {
    try {
      await processExpiredPayments();
      await processPeriodicPaymentReminders();
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

    const expiredBookings = await Booking.find({
      status: 'pending',
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
          owner_id: 1
        }).lean();

        if (customer && customer.email) {
          try {
            await sendPaymentNotCompletedEmail(customer.email, {
              customer_name: customer.name,
              venue_name: venue?.name,
              venue_location: venue?.location,
              event_date: booking.event_date,
              booking_id: booking._id.toString(),
              amount: booking.payment_amount || booking.amount
            });
          } catch (emailError) {
            console.error(
              `Failed to send payment not completed email for booking ${booking._id}:`,
              emailError
            );
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

async function processPeriodicPaymentReminders() {
  try {
    const now = new Date();
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

    const pendingPaymentBookings = await Booking.find({
      status: 'pending',
      payment_status: 'pending',
      payment_deadline: { $gt: now },
      $or: [
        { last_payment_reminder_sent_at: { $lt: sixHoursAgo } },
        { last_payment_reminder_sent_at: null }
      ]
    }).lean();

    if (pendingPaymentBookings.length === 0) {
      return;
    }

    console.log(
      `Found ${pendingPaymentBookings.length} bookings eligible for 6-hour payment reminder`
    );

    for (const booking of pendingPaymentBookings) {
      try {
        const customer = await User.findById(booking.customer_id, {
          name: 1,
          email: 1
        }).lean();

        const venue = await Venue.findById(booking.venue_id, {
          name: 1,
          location: 1
        }).lean();

        if (customer && customer.email) {
          try {
            const reminderData = {
              customer_name: customer.name,
              venue_name: venue?.name,
              venue_location: venue?.location,
              event_date: booking.event_date,
              booking_id: booking._id.toString(),
              amount: booking.payment_amount || booking.amount,
              payment_deadline: booking.payment_deadline,
              reminder_count: (booking.payment_reminder_count || 0) + 1
            };

            await sendPeriodicPaymentReminderEmail(customer.email, reminderData);
          } catch (emailError) {
            console.error(
              `Failed to send periodic payment reminder email for booking ${booking._id}:`,
              emailError
            );
          }
        }

        await Booking.updateOne(
          { _id: booking._id },
          {
            $set: {
              last_payment_reminder_sent_at: new Date()
            },
            $inc: {
              payment_reminder_count: 1
            }
          }
        );

        console.log(
          `Sent periodic payment reminder for booking ${booking._id}`
        );
      } catch (error) {
        console.error(
          `Error processing periodic reminder for booking ${booking._id}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error('Error in processPeriodicPaymentReminders:', error);
  }
}

async function sendPeriodicPaymentReminderEmail(email, data) {
  const transporter = require('nodemailer').createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const hoursRemaining = Math.ceil(
    (new Date(data.payment_deadline) - new Date()) / (1000 * 60 * 60)
  );

  const isFirstReminder = data.reminder_count === 1;
  const reminderNote = isFirstReminder
    ? 'This is your first reminder.'
    : `This is reminder #${data.reminder_count}.`;

  const mailOptions = {
    from: {
      name: 'Planzia',
      address: process.env.EMAIL_USER
    },
    to: email,
    subject: `Payment Reminder - ${data.reminder_count > 1 ? 'Final Notice' : 'Please Complete Your Booking Payment'}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Reminder</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, ${data.reminder_count > 2 ? '#e53e3e' : '#d69e2e'} 0%, ${data.reminder_count > 2 ? '#fc8181' : '#ed8936'} 100%); padding: 40px 30px; text-align: center;">
            <img src="https://drive.google.com/uc?export=view&id=1APD3W2MpXe8fAZd3b00tz4e_kMpW5CoV" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto; filter: brightness(0) invert(1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Payment Reminder ${isFirstReminder ? '' : '(Reminder #' + data.reminder_count + ')'}</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <!-- Alert Notice -->
            <div style="background: ${data.reminder_count > 2 ? '#fed7d7' : '#fed7d7'}; border: 2px solid ${data.reminder_count > 2 ? '#e53e3e' : '#ed8936'}; border-radius: 6px; padding: 20px; margin: 0 0 30px 0; text-align: center;">
              <h2 style="color: ${data.reminder_count > 2 ? '#742a2a' : '#744210'}; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
                ${hoursRemaining > 0 ? '⏰ ' + hoursRemaining + ' Hours Remaining' : '⚠️ Urgent: Payment Deadline Passed'}
              </h2>
              <p style="color: ${data.reminder_count > 2 ? '#975a16' : '#975a16'}; margin: 0; font-size: 16px;">
                ${isFirstReminder ? 'Don\'t miss your booking!' : 'This is reminder #' + data.reminder_count + ' - Please act now!'}
              </p>
            </div>

            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Dear ${data.customer_name},
            </p>

            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              ${isFirstReminder
                ? 'We\'re sending you a friendly reminder that your booking for <strong>' + data.venue_name + '</strong> is awaiting payment. Please complete the payment to secure your reservation.'
                : 'This is reminder #' + data.reminder_count + '. Your payment for <strong>' + data.venue_name + '</strong> is still pending. Complete the payment now to avoid automatic cancellation of your booking.'
              }
            </p>

            <!-- Booking & Payment Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Booking Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid ${data.reminder_count > 2 ? '#e53e3e' : '#ed8936'};">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 35%;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #2d3748; font-family: 'Courier New', monospace;">#${data.booking_id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Venue:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${data.venue_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Location:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${data.venue_location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Date:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${new Date(data.event_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Payment Amount:</td>
                    <td style="padding: 8px 0; color: #744210; font-weight: 600; font-size: 18px;">₹${data.amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #744210; font-weight: 600;">Payment Deadline:</td>
                    <td style="padding: 8px 0; color: #744210; font-weight: 600;">${new Date(data.payment_deadline).toLocaleString('en-IN')}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Urgent Action Required -->
            <div style="background: ${data.reminder_count > 2 ? '#fed7d7' : '#fffaf0'}; border: 1px solid ${data.reminder_count > 2 ? '#e53e3e' : '#fed7d7'}; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center;">
              <h3 style="color: ${data.reminder_count > 2 ? '#742a2a' : '#744210'}; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                ${data.reminder_count > 2 ? '🚨 Final Notice - Complete Payment Now' : '✓ Complete Payment Now'}
              </h3>
              <p style="color: ${data.reminder_count > 2 ? '#975a16' : '#975a16'}; margin: 0 0 20px 0; font-size: 14px; line-height: 1.5;">
                Click the button below to proceed with secure payment via Razorpay.
              </p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:8080'}/user-dashboard" style="display: inline-block; background: ${data.reminder_count > 2 ? '#e53e3e' : '#d69e2e'}; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Complete Payment Now
              </a>
            </div>

            <!-- Important Information -->
            <div style="background: #fff5cd; border: 1px solid #f6e05e; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #744210; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">⚠️ Important Information</h3>
              <ul style="color: #744210; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li style="margin: 8px 0;">Your booking will be <strong>automatically cancelled</strong> if payment is not completed before the deadline</li>
                <li style="margin: 8px 0;">You will receive reminders every 6 hours until payment is completed</li>
                <li style="margin: 8px 0;">Once cancelled, the venue becomes available for other bookings</li>
                <li style="margin: 8px 0;">All payments are secured with bank-level encryption</li>
              </ul>
            </div>

            <p style="color: #4a5568; margin: 0 0 10px 0; font-size: 14px; text-align: center;">
              If you have any questions, please contact our support team at any time.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Planzia</h4>
            <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
              Professional Venue Solutions
            </p>
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 12px;">
              This is an automated reminder. Please do not reply to this email.
            </p>
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Planzia. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending periodic payment reminder email:', error);
    return false;
  }
}

export async function triggerPaymentReminderForBooking(bookingId) {
  try {
    const booking = await Booking.findById(bookingId).lean();

    if (!booking || booking.status !== 'pending' || booking.payment_status !== 'pending') {
      return { success: false, message: 'Booking not eligible for payment reminder' };
    }

    const customer = await User.findById(booking.customer_id, {
      name: 1,
      email: 1
    }).lean();

    const venue = await Venue.findById(booking.venue_id, {
      name: 1,
      location: 1
    }).lean();

    if (customer && customer.email) {
      await sendPaymentReminderEmail(customer.email, {
        customer_name: customer.name,
        venue_name: venue?.name,
        venue_location: venue?.location,
        event_date: booking.event_date,
        booking_id: booking._id.toString(),
        amount: booking.payment_amount || booking.amount,
        payment_deadline: booking.payment_deadline
      });
    }

    return { success: true, message: 'Payment reminder sent' };
  } catch (error) {
    console.error(`Error sending payment reminder for booking ${bookingId}:`, error);
    throw error;
  }
}
