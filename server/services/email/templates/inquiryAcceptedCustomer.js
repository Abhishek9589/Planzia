import transporter from '../transporter.js';

export async function sendInquiryAcceptedToCustomer(customerEmail, inquiryData) {
  const { venue, customer, event } = inquiryData;

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
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Date: ${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400;">Type: ${event.type}</p>
                  <p style="color: #1a1a1a; margin: 0; font-size: 13px; font-weight: 400;">Guest Count: ${event.guestCount}</p>
                </div>

              </div>

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
