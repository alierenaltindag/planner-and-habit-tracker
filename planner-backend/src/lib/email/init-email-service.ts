import { logger } from '@/lib/logger';
import { getEmailConfig } from './email-config';
/**
 * Email Service Initialization
 *
 * Initialize the email service on application startup.
 * This should be called once when the app starts, ideally in a root layout
 * or dedicated initialization file.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { initializeEmailService } from '@/lib/email/init-email-service';
 *
 * // Initialize on module load (server-side only)
 * initializeEmailService();
 *
 * export default function RootLayout({ children }) {
 *   return <html>{children}</html>;
 * }
 * ```
 */
import 'server-only';
import { emailService } from './email-service';

let isInitialized = false;

/**
 * Initialize the email service
 * Safe to call multiple times - will only initialize once
 */
export function initializeEmailService(): void {
  if (isInitialized) {
    return;
  }

  try {
    const config = getEmailConfig();
    emailService.initialize(config);
    isInitialized = true;

    logger.info('Email service initialized successfully', {
      provider: config.provider,
      hasDefaultFrom: !!config.defaultFrom,
    });
  } catch (error) {
    logger.error('Failed to initialize email service', { error });
    // Don't throw - we don't want to crash the app if email is misconfigured
    // Just log the error and continue
  }
}

/**
 * Check if the email service is initialized and working
 */
export async function verifyEmailService(): Promise<boolean> {
  if (!isInitialized) {
    logger.warn('Email service not initialized');
    return false;
  }

  try {
    const isValid = await emailService.verify();
    if (!isValid) {
      logger.error('Email service verification failed');
    }
    return isValid;
  } catch (error) {
    logger.error('Email service verification error', { error });
    return false;
  }
}
