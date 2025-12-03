/**
 * Email Service Entry Point
 *
 * Provides a provider-agnostic email sending interface.
 * Configure the service on application startup with your preferred provider.
 */

export { getEmailConfig } from './email-config';
export { emailService } from './email-service';
export type {
  EmailAttachment,
  EmailProviderType,
  EmailServiceConfig,
  IEmailProvider,
  SendEmailOptions,
  SendEmailResponse,
} from './email.types';
export { initializeEmailService, verifyEmailService } from './init-email-service';
export {
  generateEmailVerificationEmail,
  generatePasswordResetEmail,
  generateWelcomeEmail,
  wrapHtmlEmail,
} from './utils/email-templates';
