import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendOTPEmail(email, otp, name = 'User', purpose = 'Verification') {
  console.log('sendOTPEmail called with:', { email, purpose, name });
  console.log('Email configuration:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? '[SET]' : '[NOT SET]'
  });

  const isPasswordReset = purpose === 'Password Reset';
  const isEmailUpdate = purpose === 'Email Update';

  const pageTitle = isPasswordReset ? 'Reset Your Password' : isEmailUpdate ? 'Verify Your New Email' : 'Welcome to Planzia';
  const headlineText = isPasswordReset ? 'Secure Your Account' : isEmailUpdate ? 'Confirm Your New Email' : 'Verify Your Email';

  const getWarmGreeting = () => {
    if (isPasswordReset) return `Hi ${name},`;
    if (isEmailUpdate) return `Hi ${name},`;
    return `Welcome to Planzia, ${name}!`;
  };

  const getWarmMessage = () => {
    if (isPasswordReset) {
      return `We received a request to reset your password. We've generated a secure verification code to help you regain access to your account. Enter the code below to proceed with your password reset.`;
    }
    if (isEmailUpdate) {
      return `You're updating your email address with us. To complete this change, we need to verify your new email. Use the verification code below to confirm.`;
    }
    return `We're thrilled to have you join our community! To complete your account setup and unlock all the amazing features Planzia has to offer, please verify your email address using the code below.`;
  };

  const mailOptions = {
    from: {
      name: 'Planzia',
      address: process.env.EMAIL_USER
    },
    to: email,
    subject: isPasswordReset ? 'Planzia - Password Reset Verification' :
             isEmailUpdate ? 'Planzia - Email Address Verification' :
             'Welcome to Planzia - Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${pageTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
          * { margin: 0; padding: 0; }
          body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f9faf7 0%, #f5f6f2 100%); font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh;">

        <!-- Outer Container -->
        <table role="presentation" width="100%" style="border-collapse: collapse; background: linear-gradient(135deg, #f9faf7 0%, #f5f6f2 100%);">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" width="100%" style="max-width: 560px; margin: 0 auto; background: #ffffff; border-collapse: collapse; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 48px rgba(42, 42, 42, 0.12);">

                <!-- Header with Logo -->
                <tr>
                  <td style="padding: 45px 40px 35px; background: linear-gradient(180deg, #ffffff 0%, #f9faf7 100%); border-bottom: 1px solid #ede9e1; text-align: center;">
                    <img src="https://cdn.builder.io/api/v1/image/assets%2F86425921e7704103a71faf5b04ebcd1a%2F4184ebb3262f4bbcb03f0987cf646790?format=webp&width=400" alt="Planzia" style="height: 40px; width: auto; display: block; margin: 0 auto 16px; object-fit: contain;" />
                    <h1 style="color: #2A2A2A; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.3px; line-height: 1.2;">${headlineText}</h1>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;">

                    <!-- Warm Greeting -->
                    <p style="color: #2A2A2A; margin: 0 0 24px 0; font-size: 16px; font-weight: 500; line-height: 1.5;">
                      ${getWarmGreeting()}
                    </p>

                    <!-- Warm Message -->
                    <p style="color: #555555; margin: 0 0 32px 0; font-size: 15px; line-height: 1.8; font-weight: 400;">
                      ${getWarmMessage()}
                    </p>

                    <!-- OTP Code Section with Premium Styling -->
                    <div style="background: linear-gradient(135deg, #f9faf7 0%, #f0f1ec 100%); border: 1px solid #dfe0d8; border-radius: 12px; padding: 36px 28px; margin: 0 0 32px 0; box-shadow: inset 0 2px 12px rgba(126, 141, 101, 0.06);">
                      <p style="color: #999999; margin: 0 0 16px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Your Verification Code</p>
                      <div style="font-family: 'Courier New', monospace; font-size: 48px; font-weight: 700; color: #7E8D65; letter-spacing: 14px; margin: 0; word-break: break-all; user-select: all; text-align: center; padding: 8px 0;">
                        ${otp.split('').join(' ')}
                      </div>
                    </div>

                    <!-- Features/Benefits Section -->
                    <div style="background: #f9faf7; border-left: 3px solid #7E8D65; border-radius: 6px; padding: 18px 20px; margin: 0 0 28px 0;">
                      <p style="color: #666666; margin: 0; font-size: 13px; line-height: 1.7; font-weight: 400;">
                        <strong style="color: #7E8D65;">🎯 Next Steps:</strong> Enter this code in your verification window. The code will expire in <strong>2 minutes</strong>, so please complete your verification shortly.
                      </p>
                    </div>

                    <!-- Security Note -->
                    <div style="background: #fef8f3; border-radius: 8px; padding: 16px 18px; border: 1px solid #f0ebe3;">
                      <p style="color: #666666; margin: 0; font-size: 12px; line-height: 1.6; font-weight: 400;">
                        <strong style="color: #8B7355;">🔒 Keep it safe:</strong> Never share this code with anyone. Planzia team members will never ask for your verification code.
                      </p>
                    </div>

                    <!-- Divider -->
                    <div style="height: 1px; background: #ede9e1; margin: 28px 0; border: none;"></div>

                    <!-- Didn't Request Section -->
                    <p style="color: #888888; margin: 0; font-size: 13px; line-height: 1.6; font-weight: 400; text-align: center;">
                      Didn't request this? Don't worry, your account is safe. Just ignore this email and your current password will remain unchanged.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 32px 40px; background: linear-gradient(180deg, #f9faf7 0%, #ede9e1 100%); border-top: 1px solid #ede9e1; text-align: center;">
                    <p style="color: #2A2A2A; margin: 0 0 8px 0; font-size: 15px; font-weight: 600;">Planzia</p>
                    <p style="color: #888888; margin: 0 0 16px 0; font-size: 13px; font-weight: 400;">Professional Venue Solutions</p>

                    <div style="border-top: 1px solid #dfe0d8; padding-top: 16px; margin-top: 0;">
                      <p style="color: #999999; margin: 0; font-size: 11px; line-height: 1.6; font-weight: 400;">
                        This is an automated message from Planzia.<br>
                        Please do not reply to this email.<br><br>
                        © ${new Date().getFullYear()} Planzia. All rights reserved.<br>
                        <a href="https://planzia.com/privacy-policy" style="color: #7E8D65; text-decoration: none; font-weight: 500;">Privacy Policy</a> •
                        <a href="https://planzia.com/terms-and-conditions" style="color: #7E8D65; text-decoration: none; font-weight: 500;">Terms & Conditions</a>
                      </p>
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>

      </body>
      </html>
    `
  };

  try {
    console.log('Attempting to send OTP email...');
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    return false;
  }
}

// Send venue inquiry email to venue owner (customer contact details hidden, price removed)
export async function sendVenueInquiryEmail(ownerEmail, inquiryData) {
  const { venue, customer, event, owner } = inquiryData;

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
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3C3B6E 0%, #6C63FF 100%); padding: 40px 30px; text-align: center;">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F86425921e7704103a71faf5b04ebcd1a%2F4184ebb3262f4bbcb03f0987cf646790?format=webp&width=800" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto;" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">New Booking Inquiry</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">New Booking Request</h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              You have received a new booking inquiry for your venue <strong>${venue.name}</strong>. Please review the details below.
            </p>

            <!-- Venue Information -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Venue Information</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #6C63FF;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Venue Name:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Location:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.location}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Customer Information -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Customer Information</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #3C3B6E;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Customer Name:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${customer.name}</td>
                  </tr>
                </table>
                <div style="background: #fff5cd; border: 1px solid #f6e05e; border-radius: 4px; padding: 15px; margin-top: 15px;">
                  <p style="color: #744210; margin: 0; font-size: 14px; line-height: 1.5;">
                    <strong>Privacy Notice:</strong> Customer contact details are protected and will be shared upon inquiry acceptance through your Planzia dashboard.
                  </p>
                </div>
              </div>
            </div>

            <!-- Event Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Event Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #38a169;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Event Date:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Type:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Guest Count:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.guestCount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Special Requests:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.specialRequests || 'None specified'}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Your Contact Information -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Your Contact Information</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #805ad5;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Email:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${owner.email || ownerEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Phone:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${owner.phone || 'Not provided'}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Action Required -->
            <div style="background: #e6fffa; border: 1px solid #38b2ac; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #234e52; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Action Required</h3>
              <p style="color: #285e61; margin: 0; font-size: 14px; line-height: 1.5;">
                Please review this inquiry and respond through your Planzia dashboard within 24 hours. Log in to your account to accept or decline this booking request.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Planzia</h4>
            <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
              Professional Venue Solutions
            </p>
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 12px;">
              This inquiry was submitted through Planzia. Customer contact details will be shared upon acceptance.
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
    console.log(`Venue inquiry email sent successfully to ${ownerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending venue inquiry email:', error);
    return false;
  }
}

// Send inquiry notification to Planzia admin (with full customer details)
export async function sendInquiryNotificationToPlanzia(inquiryData) {
  const { venue, customer, event, owner } = inquiryData;
  const PlanziaEmail = process.env.Planzia_ADMIN_EMAIL || process.env.EMAIL_USER;

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
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #e53e3e 0%, #fc8181 100%); padding: 40px 30px; text-align: center;">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F86425921e7704103a71faf5b04ebcd1a%2F4184ebb3262f4bbcb03f0987cf646790?format=webp&width=800" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto; filter: brightness(0) invert(1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 600;">ADMIN NOTIFICATION</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">New Venue Inquiry Received</h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              A new venue inquiry has been submitted through the platform. Complete details are provided below for monitoring and quality assurance.
            </p>

            <!-- Inquiry Summary -->
            <div style="background: #fff5cd; border: 1px solid #f6e05e; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #744210; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Inquiry Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #744210; font-weight: 600; width: 30%;">Venue:</td>
                  <td style="padding: 8px 0; color: #744210;">${venue.name} ${venue.id ? `(ID: ${venue.id})` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #744210; font-weight: 600;">Customer:</td>
                  <td style="padding: 8px 0; color: #744210;">${customer.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #744210; font-weight: 600;">Event Date:</td>
                  <td style="padding: 8px 0; color: #744210;">${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #744210; font-weight: 600;">Event Type:</td>
                  <td style="padding: 8px 0; color: #744210;">${event.type}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #744210; font-weight: 600;">Guest Count:</td>
                  <td style="padding: 8px 0; color: #744210;">${event.guestCount}</td>
                </tr>
              </table>
            </div>

            <!-- Venue Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Venue Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #6C63FF;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Venue Name:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Location:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Price per Day:</td>
                    <td style="padding: 8px 0; color: #2d3748;">₹${venue.price}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Customer Details (Full Access for Admin) -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Customer Details (Complete Information)</h3>
              <div style="background: #fed7d7; padding: 20px; border-radius: 6px; border-left: 4px solid #e53e3e;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #742a2a; font-weight: 600; width: 30%;">Full Name:</td>
                    <td style="padding: 8px 0; color: #742a2a;">${customer.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #742a2a; font-weight: 600;">Email Address:</td>
                    <td style="padding: 8px 0; color: #742a2a;">${customer.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #742a2a; font-weight: 600;">Phone Number:</td>
                    <td style="padding: 8px 0; color: #742a2a;">${customer.phone}</td>
                  </tr>
                </table>
                <div style="background: #fff5f5; border: 1px solid #feb2b2; border-radius: 4px; padding: 15px; margin-top: 15px;">
                  <p style="color: #742a2a; margin: 0; font-size: 14px; line-height: 1.5;">
                    <strong>Admin Access:</strong> Complete customer contact information is provided for administrative monitoring and support purposes.
                  </p>
                </div>
              </div>
            </div>

            <!-- Event Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Event Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #38a169;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Event Date:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Type:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Guest Count:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.guestCount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Special Requests:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.specialRequests || 'None specified'}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Venue Owner Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Venue Owner Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #805ad5;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Email:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${owner.email || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Phone:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${owner.phone || 'Not provided'}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Admin Monitoring Notice -->
            <div style="background: #e6fffa; border: 1px solid #38b2ac; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #234e52; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Administrative Monitoring</h3>
              <p style="color: #285e61; margin: 0; font-size: 14px; line-height: 1.5;">
                This inquiry has been logged for tracking and quality assurance. Customer contact details are protected from venue owners until inquiry acceptance.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Planzia</h4>
            <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
              Professional Venue Solutions
            </p>
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 12px;">
              Inquiry submitted at ${new Date().toLocaleString('en-IN')}
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
    console.log(`Planzia admin notification email sent successfully`);
    return true;
  } catch (error) {
    console.error('Error sending Planzia admin notification email:', error);
    return false;
  }
}

// Send booking confirmation email to customer
export async function sendBookingConfirmationEmail(customerEmail, bookingData) {
  const { customer, venue, event, bookingId } = bookingData;

  const mailOptions = {
    from: {
      name: 'Planzia',
      address: process.env.EMAIL_USER
    },
    to: customerEmail,
    subject: `Booking Confirmed - ${venue.name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmed</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #38a169 0%, #68d391 100%); padding: 40px 30px; text-align: center;">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F86425921e7704103a71faf5b04ebcd1a%2F4184ebb3262f4bbcb03f0987cf646790?format=webp&width=800" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto; filter: brightness(0) invert(1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Booking Confirmation</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <!-- Confirmation Notice -->
            <div style="background: #c6f6d5; border: 1px solid #38a169; border-radius: 6px; padding: 20px; margin: 0 0 30px 0; text-align: center;">
              <h2 style="color: #276749; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Booking Confirmed</h2>
              <p style="color: #2f855a; margin: 0; font-size: 16px;">Your venue booking has been confirmed by the venue owner.</p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Dear ${customer.name},
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Congratulations! Your booking request for <strong>${venue.name}</strong> has been confirmed. Please find your booking details below.
            </p>

            <!-- Booking Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Booking Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #38a169;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #2d3748; font-family: 'Courier New', monospace;">#${bookingId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Venue Name:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Location:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Date:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Type:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Guest Count:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.guestCount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Total Amount:</td>
                    <td style="padding: 8px 0; color: #2d3748; font-weight: 600;">₹${event.amount}</td>
                  </tr>
                </table>
              </div>
            </div>

            ${event.specialRequests && event.specialRequests !== 'None' ? `
            <!-- Special Requests -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Special Requests</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #805ad5;">
                <p style="color: #2d3748; margin: 0; font-size: 16px; line-height: 1.6;">${event.specialRequests}</p>
              </div>
            </div>
            ` : ''}

            <!-- Next Steps -->
            <div style="background: #fff5cd; border: 1px solid #f6e05e; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #744210; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Next Steps</h3>
              <ol style="color: #744210; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li style="margin: 8px 0;">The venue owner will contact you directly to finalize payment and event details</li>
                <li style="margin: 8px 0;">Please keep this email as confirmation of your booking</li>
                <li style="margin: 8px 0;">Contact the venue directly for any specific arrangements or requirements</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.6;">
                Thank you for choosing Planzia for your event needs. We wish you a successful event!
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Planzia</h4>
            <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
              Professional Venue Solutions
            </p>
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 12px;">
              If you have any questions, please contact us or the venue owner directly.
            </p>
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">
              �� ${new Date().getFullYear()} Planzia. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return false;
  }
}

// Send inquiry acceptance email to Planzia admin
export async function sendInquiryAcceptedToAdmin(inquiryData) {
  const { venue, customer, event, owner } = inquiryData;
  const PlanziaEmail = process.env.Planzia_ADMIN_EMAIL || process.env.EMAIL_USER;

  const mailOptions = {
    from: {
      name: 'Planzia System',
      address: process.env.EMAIL_USER
    },
    to: PlanziaEmail,
    subject: `[ADMIN] Venue Inquiry Accepted - ${venue.name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Notification - Inquiry Accepted</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #38a169 0%, #68d391 100%); padding: 40px 30px; text-align: center;">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F86425921e7704103a71faf5b04ebcd1a%2F4184ebb3262f4bbcb03f0987cf646790?format=webp&width=800" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto; filter: brightness(0) invert(1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 600;">INQUIRY ACCEPTED</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Venue Inquiry Successfully Accepted</h2>
            
            <div style="background: #c6f6d5; border: 1px solid #38a169; border-radius: 6px; padding: 20px; margin: 0 0 30px 0;">
              <h3 style="color: #276749; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Status Update</h3>
              <p style="color: #2f855a; margin: 0; font-size: 16px;">The venue owner has accepted the booking inquiry. Customer contact details have been shared.</p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              The following venue inquiry has been successfully accepted by the venue owner. All relevant details are provided below for administrative tracking.
            </p>

            <!-- Complete inquiry details with same structure as admin notification -->
            <!-- Venue Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Venue Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #6C63FF;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Venue Name:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Location:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Price per Day:</td>
                    <td style="padding: 8px 0; color: #2d3748;">₹${venue.price}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Customer Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Customer Details</h3>
              <div style="background: #fed7d7; padding: 20px; border-radius: 6px; border-left: 4px solid #e53e3e;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #742a2a; font-weight: 600; width: 30%;">Full Name:</td>
                    <td style="padding: 8px 0; color: #742a2a;">${customer.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #742a2a; font-weight: 600;">Email Address:</td>
                    <td style="padding: 8px 0; color: #742a2a;">${customer.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #742a2a; font-weight: 600;">Phone Number:</td>
                    <td style="padding: 8px 0; color: #742a2a;">${customer.phone}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Event Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Event Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #38a169;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Event Date:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Type:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Guest Count:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.guestCount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Special Requests:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.specialRequests || 'None specified'}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Venue Owner Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Venue Owner Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #805ad5;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Email:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${owner.email || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Phone:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${owner.phone || 'Not provided'}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Planzia</h4>
            <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
              Professional Venue Solutions
            </p>
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 12px;">
              Inquiry accepted at ${new Date().toLocaleString('en-IN')}
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
    console.log(`Inquiry acceptance notification sent to admin successfully`);
    return true;
  } catch (error) {
    console.error('Error sending inquiry acceptance email to admin:', error);
    return false;
  }
}

// Send inquiry acceptance email to customer
export async function sendInquiryAcceptedToCustomer(customerEmail, inquiryData) {
  const { venue, customer, event, owner } = inquiryData;

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
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #38a169 0%, #68d391 100%); padding: 40px 30px; text-align: center;">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F86425921e7704103a71faf5b04ebcd1a%2F4184ebb3262f4bbcb03f0987cf646790?format=webp&width=800" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto; filter: brightness(0) invert(1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Excellent News!</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <!-- Acceptance Notice -->
            <div style="background: #c6f6d5; border: 1px solid #38a169; border-radius: 6px; padding: 20px; margin: 0 0 30px 0; text-align: center;">
              <h2 style="color: #276749; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Your Venue Inquiry Has Been Accepted</h2>
              <p style="color: #2f855a; margin: 0; font-size: 16px;">The venue owner has accepted your booking inquiry for <strong>${venue.name}</strong>.</p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Dear ${customer.name},
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              We are pleased to inform you that your venue inquiry has been accepted. The venue owner is interested in hosting your event and you can now proceed with the booking process.
            </p>

            <!-- Venue Information -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Venue Information</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #6C63FF;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Venue Name:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Location:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Price per Day:</td>
                    <td style="padding: 8px 0; color: #2d3748;">₹${venue.price}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Your Event Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Your Event Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #38a169;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Event Date:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Type:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Guest Count:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.guestCount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Special Requests:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.specialRequests || 'None specified'}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Payment Instructions -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Next Steps - Complete Your Payment</h3>
              <div style="background: #fef5e7; padding: 20px; border-radius: 6px; border-left: 4px solid #d69e2e; margin: 0 0 20px 0;">
                <p style="color: #744210; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                  🔔 Payment Required to Confirm Your Booking
                </p>
                <p style="color: #975a16; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                  To secure your booking, please complete the payment process within 48 hours. Follow these simple steps:
                </p>
                <ol style="color: #975a16; margin: 0; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                  <li style="margin: 0 0 8px 0;">Log in to your Planzia dashboard</li>
                  <li style="margin: 0 0 8px 0;">Navigate to your booking history</li>
                  <li style="margin: 0 0 8px 0;">Click "Pay Now" for this booking</li>
                  <li style="margin: 0 0 8px 0;">Complete the secure payment via Razorpay</li>
                </ol>
              </div>

              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:8080'}/user-dashboard"
                   style="display: inline-block; background: #3C3B6E; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Complete Payment Now
                </a>
              </div>

              <div style="background: #e6fffa; padding: 15px; border-radius: 6px; border-left: 4px solid #38b2ac;">
                <p style="color: #234e52; margin: 0; font-size: 13px; line-height: 1.5;">
                  <strong>💳 Secure Payment:</strong> All payments are processed securely through Razorpay with bank-level encryption.<br>
                  <strong>📞 Support:</strong> Contact us if you need assistance with the payment process.
                </p>
              </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.6;">
                Thank you for choosing Planzia. We hope you have a wonderful event!
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Planzia</h4>
            <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
              Professional Venue Solutions
            </p>
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 12px;">
              We're here to help make your event successful. Best wishes!
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
    console.log(`Inquiry acceptance email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending inquiry acceptance email to customer:', error);
    return false;
  }
}

// Send inquiry rejection email to Planzia admin
export async function sendInquiryRejectedToAdmin(inquiryData) {
  const { venue, customer, event, owner } = inquiryData;
  const PlanziaEmail = process.env.Planzia_ADMIN_EMAIL || process.env.EMAIL_USER;

  const mailOptions = {
    from: {
      name: 'Planzia System',
      address: process.env.EMAIL_USER
    },
    to: PlanziaEmail,
    subject: `[ADMIN] Venue Inquiry Declined - ${venue.name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Notification - Inquiry Declined</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #e53e3e 0%, #fc8181 100%); padding: 40px 30px; text-align: center;">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F86425921e7704103a71faf5b04ebcd1a%2F4184ebb3262f4bbcb03f0987cf646790?format=webp&width=800" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto; filter: brightness(0) invert(1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 600;">INQUIRY DECLINED</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Venue Inquiry Has Been Declined</h2>
            
            <div style="background: #fed7d7; border: 1px solid #e53e3e; border-radius: 6px; padding: 20px; margin: 0 0 30px 0;">
              <h3 style="color: #742a2a; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Status Update</h3>
              <p style="color: #742a2a; margin: 0; font-size: 16px;">The venue owner has declined the booking inquiry. Customer has been notified.</p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              The following venue inquiry has been declined by the venue owner. All relevant details are provided below for administrative tracking.
            </p>

            <!-- Complete inquiry details - similar structure as other admin emails -->
            <!-- Venue Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Venue Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #6C63FF;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Venue Name:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Location:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Price per Day:</td>
                    <td style="padding: 8px 0; color: #2d3748;">₹${venue.price}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Customer Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Customer Details</h3>
              <div style="background: #fed7d7; padding: 20px; border-radius: 6px; border-left: 4px solid #e53e3e;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #742a2a; font-weight: 600; width: 30%;">Full Name:</td>
                    <td style="padding: 8px 0; color: #742a2a;">${customer.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #742a2a; font-weight: 600;">Email Address:</td>
                    <td style="padding: 8px 0; color: #742a2a;">${customer.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #742a2a; font-weight: 600;">Phone Number:</td>
                    <td style="padding: 8px 0; color: #742a2a;">${customer.phone}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Event Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Event Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #38a169;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Event Date:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Type:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Guest Count:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.guestCount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Special Requests:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.specialRequests || 'None specified'}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Venue Owner Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Venue Owner Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #805ad5;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Email:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${owner.email || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Phone:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${owner.phone || 'Not provided'}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Planzia</h4>
            <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
              Professional Venue Solutions
            </p>
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 12px;">
              Inquiry declined at ${new Date().toLocaleString('en-IN')}
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
    console.log(`Inquiry rejection notification sent to admin successfully`);
    return true;
  } catch (error) {
    console.error('Error sending inquiry rejection email to admin:', error);
    return false;
  }
}

// Send inquiry rejection email to customer
export async function sendInquiryRejectedToCustomer(customerEmail, inquiryData) {
  const { venue, customer, event } = inquiryData;

  const mailOptions = {
    from: {
      name: 'Planzia',
      address: process.env.EMAIL_USER
    },
    to: customerEmail,
    subject: `Venue Inquiry Update - ${venue.name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inquiry Update</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3C3B6E 0%, #6C63FF 100%); padding: 40px 30px; text-align: center;">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F86425921e7704103a71faf5b04ebcd1a%2F4184ebb3262f4bbcb03f0987cf646790?format=webp&width=800" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto;" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Inquiry Update</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Inquiry Status Update</h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Dear ${customer.name},
            </p>
            
            <div style="background: #fed7d7; border: 1px solid #e53e3e; border-radius: 6px; padding: 20px; margin: 0 0 30px 0;">
              <h3 style="color: #742a2a; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Inquiry Status</h3>
              <p style="color: #742a2a; margin: 0; font-size: 16px;">Unfortunately, your venue inquiry for <strong>${venue.name}</strong> could not be accommodated at this time.</p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              We understand this may be disappointing. The venue owner was unable to accommodate your request for the specified date and requirements.
            </p>

            <!-- Inquiry Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Your Inquiry Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #6C63FF;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Venue Name:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Location:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Date:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Type:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Guest Count:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.guestCount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Special Requests:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.specialRequests || 'None specified'}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Alternative Options -->
            <div style="background: #e6fffa; border: 1px solid #38b2ac; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #234e52; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Alternative Options</h3>
              <ul style="color: #285e61; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li style="margin: 8px 0;"><strong>Browse alternative venues</strong> - We have many other excellent venues that might suit your needs</li>
                <li style="margin: 8px 0;"><strong>Try different dates</strong> - The venue might be available on alternative dates</li>
                <li style="margin: 8px 0;"><strong>Contact our support team</strong> - We can help you find suitable alternatives</li>
                <li style="margin: 8px 0;"><strong>Modify requirements</strong> - Consider adjusting guest count or other specifications</li>
              </ul>
            </div>

            <!-- Browse More Venues CTA -->
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f7fafc; border-radius: 6px;">
              <p style="color: #4a5568; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                Don't let this setback stop your perfect event. Let us help you find another excellent venue.
              </p>
              <a href="${process.env.FRONTEND_URL || 'https://Planzia.com'}/venues" style="background: linear-gradient(135deg, #3C3B6E 0%, #6C63FF 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Browse Other Venues
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Planzia</h4>
            <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
              Professional Venue Solutions
            </p>
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 12px;">
              We're committed to helping you find the perfect venue for your event.
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
    console.log(`Inquiry rejection email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending inquiry rejection email to customer:', error);
    return false;
  }
}

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
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #e53e3e 0%, #fc8181 100%); padding: 40px 30px; text-align: center;">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F86425921e7704103a71faf5b04ebcd1a%2F4184ebb3262f4bbcb03f0987cf646790?format=webp&width=800" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto; filter: brightness(0) invert(1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Booking Status Update</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <!-- Cancellation Notice -->
            <div style="background: #fed7d7; border: 2px solid #e53e3e; border-radius: 6px; padding: 20px; margin: 0 0 30px 0; text-align: center;">
              <h2 style="color: #742a2a; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Booking Cancelled</h2>
              <p style="color: #742a2a; margin: 0; font-size: 16px;">Your booking has been automatically cancelled due to unpaid payment.</p>
            </div>

            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Dear ${customer_name},
            </p>

            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Unfortunately, your booking for <strong>${venue_name}</strong> has been automatically cancelled as the payment was not completed within the 24-hour deadline. The venue is now available for other bookings.
            </p>

            <!-- Cancelled Booking Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Booking Information</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #e53e3e;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 35%;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #2d3748; font-family: 'Courier New', monospace;">#${booking_id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Venue:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Location:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue_location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Date:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${new Date(event_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e2e8f0;">
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Payment Amount:</td>
                    <td style="padding: 8px 0; color: #2d3748;">₹${amount}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- What You Can Do -->
            <div style="background: #e6fffa; border: 1px solid #38b2ac; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #234e52; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What You Can Do Next</h3>
              <ol style="color: #285e61; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li style="margin: 8px 0;"><strong>Try Again</strong> - Contact the venue owner if you still want to book</li>
                <li style="margin: 8px 0;"><strong>Alternative Dates</strong> - Check venue availability for different dates</li>
                <li style="margin: 8px 0;"><strong>Browse Other Venues</strong> - Explore our wide selection of excellent venues</li>
                <li style="margin: 8px 0;"><strong>Contact Support</strong> - Our team can help you find alternatives</li>
              </ol>
            </div>

            <!-- Browse Venues CTA -->
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f7fafc; border-radius: 6px;">
              <p style="color: #4a5568; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                We're here to help you find the perfect venue for your event.
              </p>
              <a href="${process.env.FRONTEND_URL || 'https://planzia.com'}/venues" style="background: linear-gradient(135deg, #3C3B6E 0%, #6C63FF 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Browse Venues Now
              </a>
            </div>

            <p style="color: #718096; margin: 0; font-size: 14px; text-align: center;">
              If you have any questions, please contact our support team.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Planzia</h4>
            <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
              Professional Venue Solutions
            </p>
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 12px;">
              This is an automated notification. Please do not reply to this email.
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
    console.log(`Payment not completed email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending payment not completed email:', error);
    return false;
  }
}

export async function sendRatingReminderEmail(customerEmail, bookingData) {
  const { customer_name, venue_name, venue_location, event_date, booking_id } = bookingData;

  const mailOptions = {
    from: {
      name: 'Planzia',
      address: process.env.EMAIL_USER
    },
    to: customerEmail,
    subject: `Rate Your Experience at ${venue_name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rate Your Experience</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #805ad5 0%, #d6bcfa 100%); padding: 40px 30px; text-align: center;">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F86425921e7704103a71faf5b04ebcd1a%2F4184ebb3262f4bbcb03f0987cf646790?format=webp&width=800" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto; filter: brightness(0) invert(1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Share Your Feedback</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <!-- Rating Request Notice -->
            <div style="background: #ede9fe; border: 1px solid #c4b5fd; border-radius: 6px; padding: 20px; margin: 0 0 30px 0; text-align: center;">
              <h2 style="color: #5b21b6; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">🌟 We'd Love Your Feedback</h2>
              <p style="color: #6d28d9; margin: 0; font-size: 16px;">Help others discover amazing venues by sharing your experience</p>
            </div>

            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Dear ${customer_name},
            </p>

            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              We hope you had a wonderful experience at <strong>${venue_name}</strong>! Your event has now passed, and we'd love to hear about your experience. Ratings from users like you help other event planners find the perfect venue.
            </p>

            <!-- Event Summary -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Your Event Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #805ad5;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 35%;">Venue:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Location:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue_location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Date:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${new Date(event_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #2d3748; font-family: 'Courier New', monospace;">#${booking_id}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Rating CTA -->
            <div style="background: #fef5e7; border: 1px solid #f6e05e; border-radius: 6px; padding: 25px; margin: 30px 0; text-align: center;">
              <h3 style="color: #744210; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">⭐ Rate This Venue</h3>
              <p style="color: #975a16; margin: 0 0 20px 0; font-size: 14px; line-height: 1.5;">
                Share your honest feedback about the venue, service, and overall experience. Your rating helps other customers make informed decisions.
              </p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:8080'}/user-dashboard?booking=${booking_id}" style="display: inline-block; background: linear-gradient(135deg, #805ad5 0%, #d6bcfa 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: #ffffff;">
                Rate Your Venue Now
              </a>
            </div>

            <!-- Why Your Rating Matters -->
            <div style="background: #e6fffa; border: 1px solid #38b2ac; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #234e52; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Why Your Rating Matters</h3>
              <ul style="color: #285e61; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li style="margin: 8px 0;">🎯 Help other event planners find the perfect venue</li>
                <li style="margin: 8px 0;">⭐ Your honest feedback improves our platform</li>
                <li style="margin: 8px 0;">💬 Share what went well and what could be improved</li>
                <li style="margin: 8px 0;">🤝 Support venue owners in growing their business</li>
              </ul>
            </div>

            <p style="color: #4a5568; margin: 0 0 10px 0; font-size: 14px; text-align: center;">
              Thank you for using Planzia! We appreciate your feedback. 😊
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Planzia</h4>
            <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
              Professional Venue Solutions
            </p>
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 12px;">
              This is an automated message. Please do not reply to this email.
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
    console.log(`Rating reminder email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending rating reminder email:', error);
    return false;
  }
}

export async function sendPaymentCompletedEmail(customerEmail, bookingData) {
  const { customer_name, venue_name, venue_location, event_date, booking_id, amount } = bookingData;

  const mailOptions = {
    from: {
      name: 'Planzia',
      address: process.env.EMAIL_USER
    },
    to: customerEmail,
    subject: `Payment Confirmed - Your Booking is Secured ✓`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmed</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #38a169 0%, #68d391 100%); padding: 40px 30px; text-align: center;">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F86425921e7704103a71faf5b04ebcd1a%2F4184ebb3262f4bbcb03f0987cf646790?format=webp&width=800" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto; filter: brightness(0) invert(1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Payment Confirmed</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <!-- Success Notice -->
            <div style="background: #c6f6d5; border: 2px solid #38a169; border-radius: 6px; padding: 20px; margin: 0 0 30px 0; text-align: center;">
              <h2 style="color: #276749; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">✓ Payment Confirmed</h2>
              <p style="color: #2f855a; margin: 0; font-size: 16px;">Your booking is now confirmed and secured!</p>
            </div>

            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Dear ${customer_name},
            </p>

            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Congratulations! Your payment has been successfully processed. Your booking for <strong>${venue_name}</strong> is now confirmed and reserved for your event date.
            </p>

            <!-- Confirmed Booking Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Confirmed Booking Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #38a169;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 35%;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #2d3748; font-family: 'Courier New', monospace; font-weight: 600;">#${booking_id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Venue Name:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Location:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue_location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Date:</td>
                    <td style="padding: 8px 0; color: #2d3748; font-weight: 600;">${new Date(event_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Payment Amount:</td>
                    <td style="padding: 8px 0; color: #38a169; font-weight: 600; font-size: 18px;">₹${amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Booking Status:</td>
                    <td style="padding: 8px 0;"><span style="background: #c6f6d5; color: #276749; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 13px;">✓ Confirmed</span></td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Next Steps -->
            <div style="background: #e6fffa; border: 1px solid #38b2ac; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #234e52; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What Happens Next?</h3>
              <ol style="color: #285e61; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li style="margin: 8px 0;"><strong>Confirmation Sent</strong> - The venue owner has been notified of your confirmed booking</li>
                <li style="margin: 8px 0;"><strong>Direct Contact</strong> - The venue owner may contact you to finalize event details</li>
                <li style="margin: 8px 0;"><strong>Prepare Your Event</strong> - You can now proceed with planning your event</li>
                <li style="margin: 8px 0;"><strong>Post-Event Rating</strong> - You'll receive a reminder to rate your experience after the event</li>
              </ol>
            </div>

            <!-- Important Information -->
            <div style="background: #fff5cd; border: 1px solid #f6e05e; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #744210; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📌 Important Information</h3>
              <ul style="color: #744210; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li style="margin: 8px 0;">Keep this email as your booking confirmation receipt</li>
                <li style="margin: 8px 0;">Review your booking details in your Planzia dashboard</li>
                <li style="margin: 8px 0;">Contact the venue owner for any specific arrangements</li>
                <li style="margin: 8px 0;">Report any issues immediately to our support team</li>
              </ul>
            </div>

            <p style="color: #4a5568; margin: 0; font-size: 16px; text-align: center; line-height: 1.6;">
              Thank you for choosing Planzia. We wish you a wonderful and successful event! 🎉
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Planzia</h4>
            <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
              Professional Venue Solutions
            </p>
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 12px;">
              If you have any questions about your booking, please contact us.
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
    console.log(`Payment completed email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending payment completed email:', error);
    return false;
  }
}

export async function sendBookingRejectionEmail(customerEmail, bookingData) {
  const { customer, venue, event, bookingId } = bookingData;

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
        <title>Booking Update</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3C3B6E 0%, #6C63FF 100%); padding: 40px 30px; text-align: center;">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F86425921e7704103a71faf5b04ebcd1a%2F4184ebb3262f4bbcb03f0987cf646790?format=webp&width=800" alt="Planzia Logo" style="height: 60px; width: auto; margin: 0 0 15px 0; display: block; margin-left: auto; margin-right: auto;" />
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Planzia</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Booking Update</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <!-- Status Notice -->
            <div style="background: #fed7d7; border: 1px solid #e53e3e; border-radius: 6px; padding: 20px; margin: 0 0 30px 0;">
              <h2 style="color: #742a2a; margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">Booking Status Update</h2>
              <p style="color: #742a2a; margin: 0; font-size: 16px;">Unfortunately, your booking request could not be confirmed.</p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Dear ${customer.name},
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              We regret to inform you that your booking request for <strong>${venue.name}</strong> could not be confirmed by the venue owner. We understand this is disappointing news.
            </p>

            <!-- Booking Details -->
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Booking Details</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #6C63FF;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 30%;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #2d3748; font-family: 'Courier New', monospace;">#${bookingId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Venue Name:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Location:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${venue.location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Date:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Event Type:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Guest Count:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${event.guestCount}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Alternative Options -->
            <div style="background: #e6fffa; border: 1px solid #38b2ac; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #234e52; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What You Can Do Next</h3>
              <ol style="color: #285e61; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li style="margin: 8px 0;"><strong>Browse alternative venues</strong> - We have many other excellent venues that might suit your needs</li>
                <li style="margin: 8px 0;"><strong>Try different dates</strong> - The venue might be available on other dates</li>
                <li style="margin: 8px 0;"><strong>Contact our support team</strong> - Our team can help you find suitable alternatives</li>
                <li style="margin: 8px 0;"><strong>Adjust your requirements</strong> - Consider modifying guest count or other specifications</li>
              </ol>
            </div>

            <!-- Browse Venues CTA -->
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f7fafc; border-radius: 6px;">
              <p style="color: #4a5568; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                We're committed to helping you find the perfect venue for your event.
              </p>
              <a href="${process.env.FRONTEND_URL || 'https://Planzia.com'}" style="background: linear-gradient(135deg, #3C3B6E 0%, #6C63FF 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Browse Other Venues
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Planzia</h4>
            <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
              Professional Venue Solutions
            </p>
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 12px;">
              Thank you for choosing Planzia. We appreciate your understanding.
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
    console.log(`Booking rejection email sent successfully to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending booking rejection email:', error);
    return false;
  }
}
