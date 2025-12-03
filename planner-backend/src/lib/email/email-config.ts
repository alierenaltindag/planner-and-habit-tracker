import type { EmailServiceConfig } from './email.types';

/**
 * Email Service Configuration
 *
 * Centralizes email configuration from environment variables.
 * This configuration is used to initialize the email service.
 */

/**
 * Get email service configuration from environment variables
 */
export function getEmailConfig(): EmailServiceConfig {
  const provider = (process.env.EMAIL_PROVIDER || 'resend') as EmailServiceConfig['provider'];
  const apiKey = process.env.RESEND_API_KEY || '';

  if (!apiKey) {
    throw new Error('Email API key not configured. Set RESEND_API_KEY environment variable.');
  }

  return {
    provider,
    apiKey,
    defaultFrom: process.env.EMAIL_DEFAULT_FROM || 'info@planhabit.com',
    enableRetry: process.env.EMAIL_ENABLE_RETRY !== 'false',
    maxRetries: parseInt(process.env.EMAIL_MAX_RETRIES || '3', 10),
  };
}
