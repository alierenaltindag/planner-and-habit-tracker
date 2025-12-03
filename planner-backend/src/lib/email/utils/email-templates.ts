import 'server-only';

/**
 * Email Template Utilities
 *
 * Common email template helpers and pre-built templates.
 * These can be used with any email provider.
 */

/**
 * Generate a simple HTML email wrapper
 */
export function wrapHtmlEmail(content: string, title?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${title ? `<title>${title}</title>` : ''}
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
  <div class="footer">
    <p>This is an automated email. Please do not reply.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate a welcome email HTML
 */
export function generateWelcomeEmail(userName: string, loginUrl?: string): string {
  const content = `
    <h1>Welcome to Leornia! 🎉</h1>
    <p>Hi ${userName},</p>
    <p>We're excited to have you on board! You've taken the first step towards achieving your learning goals.</p>
    ${
      loginUrl
        ? `
    <p style="margin: 30px 0;">
      <a href="${loginUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Get Started
      </a>
    </p>
    `
        : ''
    }
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>Happy learning!</p>
    <p>The Leornia Team</p>
  `;

  return wrapHtmlEmail(content, 'Welcome to Leornia');
}

/**
 * Generate a password reset email HTML
 */
export function generatePasswordResetEmail(userName: string, resetUrl: string): string {
  const content = `
    <h1>Reset Your Password</h1>
    <p>Hi ${userName},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <p style="margin: 30px 0;">
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Reset Password
      </a>
    </p>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
    <p>The Leornia Team</p>
  `;

  return wrapHtmlEmail(content, 'Reset Your Password');
}

/**
 * Generate an email verification HTML
 */
export function generateEmailVerificationEmail(userName: string, verificationUrl: string): string {
  const content = `
    <h1>Verify Your Email</h1>
    <p>Hi ${userName},</p>
    <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
    <p style="margin: 30px 0;">
      <a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Verify Email
      </a>
    </p>
    <p>This link will expire in 24 hours.</p>
    <p>If you didn't create an account, you can safely ignore this email.</p>
    <p>The Leornia Team</p>
  `;

  return wrapHtmlEmail(content, 'Verify Your Email');
}
