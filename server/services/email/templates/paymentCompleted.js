import transporter from '../transporter.js';
import { formatScheduleWithTimes, calculatePriceBreakdown, generatePriceBreakupHTML } from '../utils/emailHelpers.js';

export async function sendPaymentCompletedAdminEmail(adminEmail, bookingData, venueData, ownerData, customerData) {
  const { booking_id, dates_timings, price_per_day, event_type, guest_count, special_requirements } = bookingData;
  const { name: venueName, location: venueLocation, capacity } = venueData;
  const { name: ownerName, email: ownerEmail, phone: ownerPhone } = ownerData;
  const { name: customerName, email: customerEmail, phone: customerPhone } = customerData;

  // Format schedule with times
  const schedule = formatScheduleWithTimes(dates_timings);

  // Calculate price breakdown
  let numberOfDays = schedule.numberOfDays;
  const pricePerDay = Number(price_per_day || 0);
  const venueAmount = Math.round(pricePerDay * numberOfDays);
  const platformFee = Math.round(venueAmount * 0.10);
  const gstAmount = Math.round((venueAmount + platformFee) * 0.18);
  const totalCustomerPays = venueAmount + platformFee + gstAmount;
  const ownerGets = venueAmount;
  const platformGets = platformFee + gstAmount;

  const mailOptions = {
    from: {
      name: 'Planzia System',
      address: process.env.EMAIL_USER
    },
    to: adminEmail,
    subject: `[ADMIN] Payment Received - Booking Confirmed #${booking_id}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Received - Admin Notification</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Momo+Trust+Display&family=Outfit:wght@100..900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
          h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        </style>
      </head>
      <body style="margin: 0; padding: 40px 20px; background-color: #ffffff; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">

        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 700px; margin: 0 auto; border-collapse: collapse;">
          <tr>
            <td style="padding: 0;">

              <!-- Heading -->
              <h1 style="color: #1a1a1a; margin: 0 0 32px 0; font-size: 20px; font-weight: 600; line-height: 1.4; text-align: center;">
                Payment Received - Booking <strong>Confirmed</strong>
              </h1>

              <!-- Quick Summary Box -->
              <div style="border: 2px solid #ed8936; border-radius: 6px; padding: 20px; margin: 0 0 32px 0; background-color: #fffaf0;">
                <p style="color: #744210; margin: 0 0 12px 0; font-size: 13px; font-weight: 500; text-transform: uppercase;">Quick Summary</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; color: #744210; font-size: 13px; font-weight: 400;">Booking ID:</td>
                    <td style="padding: 6px 0; color: #1a1a1a; font-family: 'Courier New', monospace; font-weight: 600; text-align: right;">#{booking_id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #744210; font-size: 13px; font-weight: 400;">Venue:</td>
                    <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600; text-align: right;">${venueName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #744210; font-size: 13px; font-weight: 400;">Customer:</td>
                    <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600; text-align: right;">${customerName}</td>
                  </tr>
                  <tr style="background-color: #fed7d7; border-top: 1px solid #ed8936;">
                    <td style="padding: 12px 0; color: #744210; font-size: 14px; font-weight: 600;">Total Payment Received:</td>
                    <td style="padding: 12px 0; color: #744210; font-size: 18px; font-weight: 700; text-align: right;">₹${totalCustomerPays.toLocaleString('en-IN')}</td>
                  </tr>
                </table>
              </div>

              <!-- Customer Information Section -->
              <div style="margin: 0 0 32px 0;">
                <h2 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Customer Information</h2>
                <div style="background-color: #f7fafc; padding: 16px; border-radius: 6px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500; width: 35%;">Name:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px;">${customerName || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500;">Email:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px;">${customerEmail || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500;">Phone:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px;">${customerPhone || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500;">Guest Count:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px;">${guest_count || 'Not specified'}</td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- Venue Information Section -->
              <div style="margin: 0 0 32px 0;">
                <h2 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Venue Information</h2>
                <div style="background-color: #f7fafc; padding: 16px; border-radius: 6px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500; width: 35%;">Name:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px;">${venueName || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500;">Location:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px;">${venueLocation || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500;">Capacity:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px;">${capacity || 'Not specified'} guests</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500;">Price/Day:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px; font-weight: 600;">₹${pricePerDay.toLocaleString('en-IN')}</td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- Venue Owner Information Section -->
              <div style="margin: 0 0 32px 0;">
                <h2 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Venue Owner Information</h2>
                <div style="background-color: #f7fafc; padding: 16px; border-radius: 6px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500; width: 35%;">Name:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px;">${ownerName || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500;">Email:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px;">${ownerEmail || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500;">Phone:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px;">${ownerPhone || 'Not provided'}</td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- Booking Details Section -->
              <div style="margin: 0 0 32px 0;">
                <h2 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Booking Details</h2>
                <div style="background-color: #f7fafc; padding: 16px; border-radius: 6px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500; width: 35%;">Event Type:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px;">${event_type || 'Not specified'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 500;">Total Days:</td>
                      <td style="padding: 8px 0; color: #1a1a1a; font-size: 13px;">${numberOfDays} ${numberOfDays === 1 ? 'day' : 'days'}</td>
                    </tr>
                  </table>

                  <p style="color: #4a5568; margin: 16px 0 8px 0; font-size: 13px; font-weight: 500;">Event Schedule:</p>
                  <div style="background-color: #fafbfc; padding: 12px; border-radius: 4px; border-left: 3px solid #ed8936;">
                    ${schedule.scheduleHTML}
                  </div>

                  ${special_requirements ? `
                    <p style="color: #4a5568; margin: 16px 0 8px 0; font-size: 13px; font-weight: 500;">Special Requirements:</p>
                    <p style="color: #1a1a1a; margin: 0; font-size: 13px; background-color: #fffaf0; padding: 12px; border-radius: 4px; border-left: 3px solid #ed8936;">${special_requirements}</p>
                  ` : ''}
                </div>
              </div>

              <!-- Financial Breakdown Section -->
              <div style="margin: 0 0 32px 0;">
                <h2 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Financial Breakdown</h2>

                <!-- Customer Payment Section -->
                <div style="background-color: #e6f3ff; border: 2px solid #38b2ac; border-radius: 6px; padding: 16px; margin: 0 0 16px 0;">
                  <p style="color: #0c5460; margin: 0 0 12px 0; font-size: 13px; font-weight: 600; text-transform: uppercase;">What Customer Pays</p>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 0; color: #0c5460; font-size: 13px; font-weight: 400; border-bottom: 1px solid #38b2ac;">Venue Amount (${numberOfDays} ${numberOfDays === 1 ? 'day' : 'days'} × ₹${pricePerDay.toLocaleString('en-IN')})</td>
                      <td style="padding: 10px 0; text-align: right; color: #0c5460; font-size: 13px; font-weight: 500; border-bottom: 1px solid #38b2ac;">₹${venueAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #0c5460; font-size: 13px; font-weight: 400; border-bottom: 1px solid #38b2ac;">Platform Fee (10%)</td>
                      <td style="padding: 10px 0; text-align: right; color: #0c5460; font-size: 13px; font-weight: 500; border-bottom: 1px solid #38b2ac;">₹${platformFee.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #0c5460; font-size: 13px; font-weight: 400; border-bottom: 1px solid #38b2ac;">GST (18%)</td>
                      <td style="padding: 10px 0; text-align: right; color: #0c5460; font-size: 13px; font-weight: 500; border-bottom: 1px solid #38b2ac;">₹${gstAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style="background-color: #0c5460;">
                      <td style="padding: 14px 0; color: #ffffff; font-size: 14px; font-weight: 600;">TOTAL CUSTOMER PAYS</td>
                      <td style="padding: 14px 0; text-align: right; color: #ffffff; font-size: 16px; font-weight: 700;">₹${totalCustomerPays.toLocaleString('en-IN')}</td>
                    </tr>
                  </table>
                </div>

                <!-- Revenue Distribution Section -->
                <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 6px; padding: 16px;">
                  <p style="color: #166534; margin: 0 0 12px 0; font-size: 13px; font-weight: 600; text-transform: uppercase;">Revenue Distribution</p>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 0; color: #166534; font-size: 13px; font-weight: 400; border-bottom: 1px solid #22c55e;">Venue Owner Receives</td>
                      <td style="padding: 10px 0; text-align: right; color: #166534; font-size: 13px; font-weight: 600; border-bottom: 1px solid #22c55e;">₹${ownerGets.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style="background-color: #dcfce7;">
                      <td style="padding: 14px 0; color: #166534; font-size: 14px; font-weight: 600;">Planzia Platform Receives</td>
                      <td style="padding: 14px 0; text-align: right; color: #166534; font-size: 16px; font-weight: 700;">₹${platformGets.toLocaleString('en-IN')}</td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- Admin Notice -->
              <div style="background-color: #fffbea; border: 1px solid #f6e05e; border-radius: 6px; padding: 16px; margin: 0 0 32px 0;">
                <p style="color: #744210; margin: 0; font-size: 13px; font-weight: 400; line-height: 1.6;">
                  <strong>Note:</strong> This is an automated admin notification for record-keeping and financial tracking. The venue owner and customer have received their respective confirmation emails.
                </p>
              </div>

              <!-- Sign Off -->
              <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                Thanks,
              </p>
              <p style="color: #1a1a1a; margin: 0 0 32px 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                The Planzia System
              </p>

              <!-- Footer -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
                <p style="color: #718096; margin: 0; font-size: 12px; font-weight: 400; line-height: 1.6;">
                  This email contains confidential information and is intended for Planzia administrators only. This is an automated notification and should not be replied to.
                </p>
              </div>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Payment completed admin notification sent successfully to ${adminEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending payment completed admin notification:', error);
    return false;
  }
}

export async function sendPaymentCompletedEmail(customerEmail, bookingData) {
  const { customer_name, venue_name, venue_location, event_date, booking_id, amount, dates_timings, price_per_day, payment_amount } = bookingData;

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
    subject: `Payment Confirmed - Your Booking is Secured 💰`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmed</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Momo+Trust+Display&family=Outfit:wght@100..900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
          h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        </style>
      </head>
      <body style="margin: 0; padding: 40px 20px; background-color: #ffffff; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">

        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 600px; margin: 0 auto; border-collapse: collapse;">
          <tr>
            <td style="padding: 0;">

              <!-- Heading -->
              <h1 style="color: #1a1a1a; margin: 0 0 32px 0; font-size: 18px; font-weight: 400; line-height: 1.4; text-align: center;">
                Payment Confirmed - Your Booking is <strong>Secured</strong>
              </h1>

              <!-- Content Box -->
              <div style="border: 1px solid #d0d7de; border-radius: 6px; padding: 20px; margin: 0 0 32px 0; background-color: #f6f8fa;">

                <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400; line-height: 1.5;">
                  Congratulations! Your payment has been successfully processed and your booking is now fully confirmed.
                </p>

                <!-- Payment Details -->
                <div style="margin: 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Booking ID:</p>
                  <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400;">#${booking_id}</p>

                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Venue:</p>
                  <p style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 14px; font-weight: 400;">${venue_name}</p>
                  <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400;">${venue_location}</p>

                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Total Days: ${schedule.numberOfDays} ${schedule.numberOfDays === 1 ? 'day' : 'days'}</p>

                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Event Schedule:</p>
                  <div style="margin: 0 0 16px 0; background-color: #fafbfc; padding: 12px; border-radius: 4px; border-left: 3px solid #ed8936;">
                    ${schedule.scheduleHTML}
                  </div>
                </div>

              </div>

              <!-- Price Breakup -->
              ${priceBreakupHTML}

              <!-- Next Steps -->
              <p style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">What's Next:</p>
              <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 13px; font-weight: 400; line-height: 1.6;">
                The venue owner will contact you with final event details. Keep your booking ID safe and check your confirmation email for all details.
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
                Thank you for choosing Planzia. We wish you a successful event!
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
    console.log(`Payment completed email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending payment completed email:', error);
    return false;
  }
}
