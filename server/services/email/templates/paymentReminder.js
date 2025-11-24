import transporter from '../transporter.js';

export async function sendPaymentReminderEmail(email, data) {
  const hoursRemaining = Math.ceil(
    (new Date(data.payment_deadline) - new Date()) / (1000 * 60 * 60)
  );

  const mailOptions = {
    from: {
      name: 'Planzia',
      address: process.env.EMAIL_USER
    },
    to: email,
    subject: `Payment Reminder - Complete Your Booking for ${data.venue_name}`,
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
          <div style="background: linear-gradient(135deg, #d69e2e 0%, #ed8936 100%); padding: 40px 30px; text-align: center;">
            <img src="https://drive.google.com/uc?export=view&id=1APD3W2MpXe8fAZd3b00tz4e_kMpW5CoV" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto; filter: brightness(0) invert(1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Payment Reminder</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <!-- Warning Notice -->
            <div style="background: #fed7d7; border: 2px solid #ed8936; border-radius: 6px; padding: 20px; margin: 0 0 30px 0; text-align: center;">
              <h2 style="color: #744210; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">⏰ Complete Your Payment Now</h2>
              <p style="color: #975a16; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                ${hoursRemaining > 0 ? `${hoursRemaining} hours remaining` : 'Payment deadline expired!'}
              </p>
              <p style="color: #975a16; margin: 0; font-size: 14px;">
                Your booking will be automatically cancelled if payment is not completed in time.
              </p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Dear ${data.customer_name},
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              This is a friendly reminder that your booking for <strong>${data.venue_name}</strong> is awaiting payment confirmation. Please complete the payment within the specified time to secure your reservation.
            </p>

            <!-- Booking & Payment Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Booking Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #ed8936;">
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
                  <tr style="border-top: 1px solid #e2e8f0;">
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

            <!-- Action Required -->
            <div style="background: #fffaf0; border: 1px solid #fed7d7; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center;">
              <h3 style="color: #744210; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Complete Your Payment Now</h3>
              <p style="color: #975a16; margin: 0 0 20px 0; font-size: 14px; line-height: 1.5;">
                Click the button below to proceed with secure payment via Razorpay.
              </p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:8080'}/user-dashboard" style="display: inline-block; background: linear-gradient(135deg, #d69e2e 0%, #ed8936 100%); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Complete Payment Now
              </a>
            </div>

            <!-- Important Information -->
            <div style="background: #fff5cd; border: 1px solid #f6e05e; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #744210; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">⚠️ Important Information</h3>
              <ul style="color: #744210; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li style="margin: 8px 0;">Your booking will be <strong>automatically cancelled</strong> if payment is not completed before the deadline</li>
                <li style="margin: 8px 0;">Once cancelled, the venue becomes available for other bookings</li>
                <li style="margin: 8px 0;">You will receive a confirmation email immediately after successful payment</li>
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
    console.error('Error sending payment reminder email:', error);
    return false;
  }
}
