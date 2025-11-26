import transporter from '../transporter.js';
import { formatScheduleWithTimes, calculatePriceBreakdown, generatePriceBreakupHTML } from '../utils/emailHelpers.js';

export async function sendInquiryAcceptedToCustomer(customerEmail, inquiryData) {
  const { venue, customer, event, dates_timings, price_per_day } = inquiryData;

  // Format schedule with times
  const schedule = formatScheduleWithTimes(dates_timings);

  // Calculate price breakdown
  let priceBreakdown = null;
  let priceBreakupHTML = '';

  if (price_per_day && schedule.numberOfDays > 0) {
    priceBreakdown = calculatePriceBreakdown(price_per_day, schedule.numberOfDays);
    priceBreakupHTML = generatePriceBreakupHTML(priceBreakdown);
  }

  const mailOptions = {
    from: {
      name: 'Planzia',
      address: process.env.EMAIL_USER
    },
    to: customerEmail,
    subject: `Venue Inquiry Accepted - ${venue.name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inquiry Accepted</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Momo+Trust+Display&family=Outfit:wght@100..900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
          h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        </style>
      </head>
      <body style="margin: 0; padding: 40px 20px; background-color: #ffffff; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">

        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 600px; margin: 0 auto; border-collapse: collapse;">
          <tr>
            <td style="padding: 0;">

              <!-- Heading -->
              <h1 style="color: #1a1a1a; margin: 0 0 32px 0; font-size: 18px; font-weight: 400; line-height: 1.4; text-align: center;">
                Your Venue Inquiry Has Been Accepted
              </h1>

              <!-- Content Box -->
              <div style="border: 1px solid #d0d7de; border-radius: 6px; padding: 20px; margin: 0 0 32px 0; background-color: #f6f8fa;">

                <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400; line-height: 1.5;">
                  Great news, <strong>${customer.name}</strong>! The venue owner has accepted your booking inquiry for <strong>${venue.name}</strong>.
                </p>

                <!-- Success Message -->
                <div style="background-color: #e6ffed; border: 1px solid #38a169; border-radius: 6px; padding: 12px; margin: 0 0 16px 0;">
                  <p style="color: #22543d; margin: 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                    Venue owner is interested in hosting your event. Proceed with payment to confirm your booking.
                  </p>
                </div>

                <!-- Venue Information -->
                <div style="margin: 0 0 16px 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Venue Information:</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Name: ${venue.name}</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Location: ${venue.location}</p>
                  <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 13px; font-weight: 400;">Price per Day: ₹${venue.price}</p>
                </div>

                <!-- Event Details -->
                <div style="margin: 0 0 16px 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Event Details:</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Type: ${event.type}</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Guest Count: ${event.guestCount}</p>
                  <p style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 13px; font-weight: 400;">Total Days: ${schedule.numberOfDays} ${schedule.numberOfDays === 1 ? 'day' : 'days'}</p>

                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Event Schedule:</p>
                  <div style="margin: 0; background-color: #fafbfc; padding: 12px; border-radius: 4px; border-left: 3px solid #ed8936;">
                    ${schedule.scheduleHTML}
                  </div>
                </div>

              </div>

              <!-- Price Breakup -->
              ${priceBreakupHTML}

              <!-- Payment Instructions -->
              <p style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 14px; font-weight: 400; line-height: 1.5;">
                <strong>Next Steps:</strong> Payment instructions (48-hour deadline)
              </p>

              <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                Log in to your Planzia dashboard and complete the payment via Razorpay to secure your booking. Payment must be completed within 48 hours.
              </p>

              <!-- Sign Off -->
              <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                Thanks,
              </p>
              <p style="color: #1a1a1a; margin: 0 0 32px 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                The Planzia Team
              </p>

              <!-- Footer Message -->
              <p style="color: #666666; margin: 0; font-size: 12px; font-weight: 400; line-height: 1.6;">
                Your Razorpay payment link is available on the Planzia dashboard. Complete payment to finalize your booking.
              </p>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Inquiry acceptance email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending inquiry acceptance email to customer:', error);
    return false;
  }
}
