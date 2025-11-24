import transporter from '../transporter.js';

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

  const getPageTitle = () => {
    if (isPasswordReset) return 'Reset Your Password';
    if (isEmailUpdate) return 'Verify Your New Email';
    return 'Verify Your Email';
  };

  const getSubject = () => {
    if (isPasswordReset) return 'Planzia - Password Reset Verification';
    if (isEmailUpdate) return 'Planzia - Email Address Verification';
    return 'Planzia - Account Registration OTP';
  };

  const getPurposeMessage = () => {
    if (isPasswordReset) {
      return `We received a request to reset your password. Use the verification code below to complete the reset process.`;
    }
    if (isEmailUpdate) {
      return `You're updating your email address. Please verify your new email using the code below.`;
    }
    return `Welcome to Planzia! Please verify your email address using the code below.`;
  };

  const mailOptions = {
    from: {
      name: 'Planzia',
      address: process.env.EMAIL_USER
    },
    to: email,
    subject: getSubject(),
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${getPageTitle()}</title>
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

              <!-- Heading with Username -->
              <h1 style="color: #1a1a1a; margin: 0 0 32px 0; font-size: 18px; font-weight: 400; line-height: 1.4; text-align: center;">
                Please verify your identity, <strong>${name}</strong>
              </h1>

              <!-- Code Box (GitHub style) -->
              <div style="border: 1px solid #d0d7de; border-radius: 6px; padding: 20px; margin: 0 0 32px 0; background-color: #f6f8fa;">

                <p style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; font-weight: 400; line-height: 1.5;">
                  Here is your Planzia verification code:
                </p>

                <!-- OTP Code with Spaced Digits -->
                <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 400; color: #1a1a1a; letter-spacing: 4px; margin: 0 0 16px 0; text-align: center; user-select: all;">
                  ${otp.split('').join(' ')}
                </div>

                <!-- Code Validity Info -->
                <p style="color: #424a52; margin: 0 0 12px 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                  This code is valid for <strong>2 minutes</strong> and can only be used once.
                </p>

                <!-- Security Warning -->
                <p style="color: #424a52; margin: 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                  Please don't share this code with anyone: we'll never ask for it on the phone or via email.
                </p>

              </div>

              <!-- Sign Off -->
              <p style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                Thanks,
              </p>
              <p style="color: #1a1a1a; margin: 0 0 32px 0; font-size: 13px; font-weight: 400; line-height: 1.5;">
                The Planzia Team
              </p>

              <!-- Footer Message -->
              <p style="color: #666666; margin: 0; font-size: 12px; font-weight: 400; line-height: 1.6;">
                You're receiving this email because a verification code was requested for your Planzia account. If this wasn't you, please ignore this email.
              </p>

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
