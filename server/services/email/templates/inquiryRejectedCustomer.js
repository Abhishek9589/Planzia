import transporter from '../transporter.js';

export async function sendInquiryRejectedToCustomer(customerEmail, inquiryData) {
  const { venue, customer, event } = inquiryData;

  const mailOptions = {
    from: {
      name: 'Planzia',
      address: process.env.EMAIL_USER
    },
    to: customerEmail,
    subject: `Booking Status Update - ${venue.name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Status Update</title>
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
                Booking Status <strong>Update</strong>
              </h1>

              <!-- Content Box -->
              <div style="border: 1px solid #d0d7de; border-radius: 6px; padding: 20px; margin: 0 0 32px 0; background-color: #f6f8fa;">

                <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400; line-height: 1.5;">
                  Unfortunately, your booking inquiry for <strong>${venue.name}</strong> has been declined by the venue owner and could not be accommodated.
                </p>

                <!-- Booking Details -->
                <div style="margin: 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Your Booking Details:</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Venue: ${venue.name}</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Location: ${venue.location}</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Event Date: ${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Event Type: ${event.type}</p>
                  <p style="color: #1a1a1a; margin: 0; font-size: 13px; font-weight: 400;">Guest Count: ${event.guestCount}</p>
                </div>

              </div>

              <!-- Alternative Options -->
              <p style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Alternative Options:</p>
              <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 13px; font-weight: 400; line-height: 1.6;">
                • Browse other venues - Explore other excellent options<br>
                • Try different dates - The venue might be available on other dates<br>
                • Contact support - We can help you find alternatives
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
                We're committed to helping you find the perfect venue for your event.
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
    console.log(`Inquiry rejection email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending inquiry rejection email to customer:', error);
    return false;
  }
}
