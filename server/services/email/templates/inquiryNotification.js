import transporter from '../transporter.js';

export async function sendInquiryNotificationToPlanzia(inquiryData) {
  const { venue, customer, event, owner } = inquiryData;
  const PlanziaEmail = process.env.Planzia_ADMIN_EMAIL || process.env.EMAIL_USER;

  const baseAmount = Number(venue.price) || 0;
  const platformFeeRate = 0.10;
  const gstRate = 0.18;
  const platformFee = baseAmount * platformFeeRate;
  const gstAmount = (baseAmount + platformFee) * gstRate;
  const totalCustomerPays = baseAmount + platformFee + gstAmount;
  const venueOwnerGets = baseAmount;

  const mailOptions = {
    from: {
      name: 'Planzia System',
      address: process.env.EMAIL_USER
    },
    to: PlanziaEmail,
    subject: `[ADMIN] New Venue Inquiry - ${venue.name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Notification - New Inquiry</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        </style>
      </head>
      <body style="margin: 0; padding: 40px 20px; background-color: #ffffff; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">

        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 600px; margin: 0 auto; border-collapse: collapse;">
          <tr>
            <td style="padding: 0;">

              <!-- Logo -->
              <div style="text-align: center; margin: 0 0 32px 0;">
                <img src="https://drive.google.com/uc?export=view&id=1APD3W2MpXe8fAZd3b00tz4e_kMpW5CoV" alt="Planzia Logo" style="height: 40px; width: auto; display: block; margin: 0 auto; object-fit: contain;" />
              </div>

              <!-- Heading -->
              <h1 style="color: #1a1a1a; margin: 0 0 32px 0; font-size: 18px; font-weight: 400; line-height: 1.4; text-align: center;">
                New Venue Inquiry Received
              </h1>

              <!-- Content Box -->
              <div style="border: 1px solid #d0d7de; border-radius: 6px; padding: 20px; margin: 0 0 32px 0; background-color: #f6f8fa;">

                <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400; line-height: 1.5;">
                  A new venue inquiry has been submitted through the platform. Complete details are provided below for monitoring and quality assurance.
                </p>

                <!-- Inquiry Summary -->
                <div style="margin: 0 0 16px 0; background-color: #fffbea; border: 1px solid #f6e05e; border-radius: 6px; padding: 12px;">
                  <p style="color: #744210; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Inquiry Summary:</p>
                  <p style="color: #744210; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Venue: ${venue.name}</p>
                  <p style="color: #744210; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Customer: ${customer.name}</p>
                  <p style="color: #744210; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Event Date: ${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p style="color: #744210; margin: 0; font-size: 13px; font-weight: 400;">Guest Count: ${event.guestCount}</p>
                </div>

                <!-- Venue Details -->
                <div style="margin: 0 0 16px 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Venue Details:</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Name: ${venue.name}</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Location: ${venue.location}</p>
                  <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 13px; font-weight: 400;">Base Price: ₹${Number(venue.price).toLocaleString('en-IN')}</p>
                </div>

                <!-- Venue Owner Details -->
                <div style="margin: 0 0 16px 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Venue Owner Details:</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Name: ${owner.name || 'Not provided'}</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Email: ${owner.email || 'Not provided'}</p>
                  <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 13px; font-weight: 400;">Phone: ${owner.phone || 'Not provided'}</p>
                </div>

                <!-- Customer Details (Full Access for Admin) -->
                <div style="margin: 0 0 16px 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Customer Details (Complete Information):</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Name: ${customer.name || 'Not provided'}</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Email: ${customer.email || 'Not provided'}</p>
                  <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 13px; font-weight: 400;">Phone: ${customer.phone || 'Not provided'}</p>
                </div>

                <!-- Event Details -->
                <div style="margin: 0 0 16px 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Event Details:</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Date: ${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Type: ${event.type || 'Not specified'}</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Guest Count: ${event.guestCount || 'Not specified'}</p>
                  <p style="color: #1a1a1a; margin: 0; font-size: 13px; font-weight: 400;">Special Requests: ${event.specialRequests || 'None specified'}</p>
                </div>

                <!-- Payment Details -->
                <div style="margin: 0 0 16px 0; background-color: #e6f3ff; border: 1px solid #38b2ac; border-radius: 6px; padding: 12px;">
                  <p style="color: #0c5460; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Payment Breakdown:</p>
                  <p style="color: #0c5460; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Venue Owner Gets: ₹${Number(venueOwnerGets).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                  <p style="color: #0c5460; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Platform Fee (10%): ₹${Number(platformFee).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                  <p style="color: #0c5460; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">GST (18%): ₹${Number(gstAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                  <p style="color: #0c5460; margin: 0; font-size: 13px; font-weight: 600; border-top: 1px solid #38b2ac; padding-top: 8px; margin-top: 8px;">Total Customer Pays: ₹${Number(totalCustomerPays).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                </div>

              </div>

              <!-- Admin Notice -->
              <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400; line-height: 1.5;">
                This inquiry has been logged for tracking and quality assurance. Customer contact details are protected from venue owners until inquiry acceptance.
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
                This is an automated notification for administrative monitoring purposes.
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
    console.log(`Planzia admin notification email sent successfully`);
    return true;
  } catch (error) {
    console.error('Error sending Planzia admin notification email:', error);
    return false;
  }
}
