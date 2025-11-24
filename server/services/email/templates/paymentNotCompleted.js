import transporter from '../transporter.js';

export async function sendPaymentNotCompletedEmail(customerEmail, bookingData) {
  const { customer_name, venue_name, venue_location, event_date, booking_id, amount } = bookingData;

  const mailOptions = {
    from: {
      name: 'Planzia',
      address: process.env.EMAIL_USER
    },
    to: customerEmail,
    subject: `Booking Cancelled - Payment Not Completed`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Cancelled</title>
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
                Booking Cancelled - <strong>Payment Not Completed</strong>
              </h1>

              <!-- Content Box -->
              <div style="border: 1px solid #d0d7de; border-radius: 6px; padding: 20px; margin: 0 0 32px 0; background-color: #f6f8fa;">

                <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400; line-height: 1.5;">
                  Your booking has been automatically cancelled after the 24-hour payment deadline. The venue is now available for other bookings.
                </p>

                <!-- Cancelled Booking Details -->
                <div style="margin: 0;">
                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Booking ID:</p>
                  <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400;">#${booking_id}</p>

                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Venue:</p>
                  <p style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 14px; font-weight: 400;">${venue_name}</p>
                  <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400;">${venue_location}</p>

                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Event Date:</p>
                  <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400;">${new Date(event_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

                  <p style="color: #424a52; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">Amount Owed:</p>
                  <p style="color: #1a1a1a; margin: 0; font-size: 14px; font-weight: 400;">₹${amount}</p>
                </div>

              </div>

              <!-- Options -->
              <p style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">What You Can Do:</p>
              <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 13px; font-weight: 400; line-height: 1.6;">
                • Try Again - Contact the venue owner if you still want to book<br>
                • Alternative Dates - Check venue availability for different dates<br>
                • Browse Other Venues - Explore our wide selection of venues<br>
                • Contact Support - Our team can help you find alternatives
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
                We're here to help you find the perfect venue. If you have any questions, please contact our support team.
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
    console.log(`Payment not completed email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending payment not completed email:', error);
    return false;
  }
}
