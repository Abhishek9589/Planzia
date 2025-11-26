import transporter from '../transporter.js';

export async function sendVenueInquiryEmail(ownerEmail, inquiryData) {
  const { venue, customer, event, priceBreakdown } = inquiryData;

  const mailOptions = {
    from: {
      name: 'Planzia',
      address: process.env.EMAIL_USER
    },
    to: ownerEmail,
    subject: `New Booking Inquiry - ${venue.name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Inquiry</title>
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
                New Booking Inquiry for <strong>${venue.name}</strong>
              </h1>

              <!-- Content Box -->
              <div style="border: 1px solid #d0d7de; border-radius: 6px; padding: 20px; margin: 0 0 32px 0; background-color: #f6f8fa;">

                <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400; line-height: 1.5;">
                  You have received a new booking inquiry. Please review the details below:
                </p>

                <!-- Venue Information -->
                <div style="margin: 0 0 16px 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Venue:</p>
                  <p style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 14px; font-weight: 400;">${venue.name}</p>
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Location:</p>
                  <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400;">${venue.location}</p>
                </div>

                <!-- Customer Information -->
                <div style="margin: 0 0 16px 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Customer Name:</p>
                  <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400;">${customer.name}</p>
                </div>

                <!-- Privacy Notice -->
                <div style="background-color: #fffbea; border: 1px solid #f6e05e; border-radius: 6px; padding: 12px; margin: 0 0 16px 0;">
                  <p style="color: #744210; margin: 0; font-size: 12px; font-weight: 400; line-height: 1.5;">
                    <strong>Privacy Notice:</strong> Customer contact details are protected and will be shared upon inquiry acceptance through your Planzia dashboard.
                  </p>
                </div>

                <!-- Event Details -->
                <div style="margin: 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Event Dates & Times:</p>
                  ${event.dates_timings && event.dates_timings.length > 0 ? event.dates_timings.map((dateInfo, index) => `
                    <p style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 13px; font-weight: 400;">
                      <strong>Date ${index + 1}:</strong> ${new Date(dateInfo.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      ${dateInfo.timing && dateInfo.timing.timeFromHour ? ` • ${dateInfo.timing.timeFromHour}:${dateInfo.timing.timeFromMinute || '00'} ${dateInfo.timing.timeFromPeriod} - ${dateInfo.timing.timeToHour}:${dateInfo.timing.timeToMinute || '00'} ${dateInfo.timing.timeToPeriod}` : ''}
                    </p>
                  `).join('') : `
                    <p style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 13px; font-weight: 400;">${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  `}
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500; margin-top: 12px;">Event Type:</p>
                  <p style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 14px; font-weight: 400;">${event.type}</p>
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Guest Count:</p>
                  <p style="color: #1a1a1a; margin: 0; font-size: 14px; font-weight: 400;">${event.guestCount}</p>
                </div>

                <!-- Price Breakdown -->
                ${priceBreakdown ? `
                <div style="margin: 16px 0 0 0; background-color: #e6f3ff; border: 1px solid #38b2ac; border-radius: 6px; padding: 12px;">
                  <p style="color: #0c5460; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Price Breakdown:</p>
                  ${priceBreakdown.days > 1 ? `
                    <p style="color: #0c5460; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Base Price: ₹${Number(priceBreakdown.perDay).toLocaleString('en-IN', { maximumFractionDigits: 0 })} × ${priceBreakdown.days} days = ₹${Number(priceBreakdown.baseTotal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  ` : `
                    <p style="color: #0c5460; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Base Price: ₹${Number(priceBreakdown.baseTotal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  `}
                  <p style="color: #0c5460; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Platform Fee (10%): ₹${Number(priceBreakdown.platformFee).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  <p style="color: #0c5460; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">GST (18%): ₹${Number(priceBreakdown.gst).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  <p style="color: #0c5460; margin: 0; font-size: 13px; font-weight: 600; border-top: 1px solid #38b2ac; padding-top: 8px; margin-top: 8px;">Total Amount: ₹${Number(priceBreakdown.total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                </div>
                ` : ''}

              </div>

              <!-- Action Message -->
              <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400; line-height: 1.5;">
                Please review this inquiry and respond through your Planzia dashboard <strong>within 24 hours</strong>.
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
                Customer contact details are protected until you accept the inquiry through the Planzia platform.
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
    console.log(`Venue inquiry email sent successfully to ${ownerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending venue inquiry email:', error);
    return false;
  }
}
