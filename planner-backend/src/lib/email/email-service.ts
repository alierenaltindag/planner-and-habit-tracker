import { logger } from '../../utils/logger';
import type {
  EmailProviderType,
  EmailServiceConfig,
  IEmailProvider,
  SendEmailOptions,
  SendEmailResponse,
} from './email.types';
import { ResendProvider } from './providers/resend-provider';

/**
 * Email Service
 *
 * Provider-agnostic email service that supports multiple email providers.
 * Uses the strategy pattern to allow swapping between providers without
 * changing the consuming code.
 *
 * @example
 * ```ts
 * import { emailService } from '@/lib/email';
 *
 * const result = await emailService.sendEmail({
 *   from: 'noreply@example.com',
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Welcome to our platform</h1>',
 * });
 * ```
 */
class EmailService {
  private provider: IEmailProvider | null = null;
  private defaultFrom: string | null = null;

  /**
   * Initialize the email service with a provider
   */
  initialize(config: EmailServiceConfig): void {
    this.defaultFrom = config.defaultFrom || null;

    // Create provider instance based on configuration
    this.provider = this.createProvider(config.provider, config.apiKey, config.maxRetries);

    logger.info('Email service initialized', {
      provider: config.provider,
      hasDefaultFrom: !!this.defaultFrom,
    });
  }

  /**
   * Send an email
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResponse> {
    if (!this.provider) {
      logger.error('Email service not initialized');
      return {
        success: false,
        error: 'Email service not initialized',
      };
    }

    // Use default from if not specified
    const emailOptions = {
      ...options,
      from: options.from || this.defaultFrom || '',
    };

    if (!emailOptions.from) {
      logger.error('No sender email specified');
      return {
        success: false,
        error: 'No sender email specified',
      };
    }

    return this.provider.sendEmail(emailOptions);
  }

  /**
   * Send multiple emails in a batch
   */
  async sendBatch(emails: SendEmailOptions[]): Promise<SendEmailResponse[]> {
    if (!this.provider) {
      logger.error('Email service not initialized');
      return emails.map(() => ({
        success: false,
        error: 'Email service not initialized',
      }));
    }

    if (!this.provider.sendBatch) {
      logger.warn('Batch sending not supported by provider, sending individually');
      return Promise.all(emails.map((email) => this.sendEmail(email)));
    }

    // Apply default from to all emails if not specified
    const emailsWithDefaults = emails.map((email) => ({
      ...email,
      from: email.from || this.defaultFrom || '',
    }));

    return this.provider.sendBatch(emailsWithDefaults);
  }

  /**
   * Verify the email service is properly configured
   */
  async verify(): Promise<boolean> {
    if (!this.provider) {
      logger.error('Email service not initialized');
      return false;
    }

    if (!this.provider.verify) {
      logger.warn('Provider does not support verification');
      return true; // Assume it works if verification is not supported
    }

    return this.provider.verify();
  }

  /**
   * Create a provider instance based on the provider type
   */
  private createProvider(
    providerType: EmailProviderType,
    apiKey: string,
    maxRetries = 3,
  ): IEmailProvider {
    switch (providerType) {
      case 'resend':
        return new ResendProvider(apiKey, maxRetries);
      case 'ses':
        throw new Error('AWS SES provider not yet implemented');
      default:
        throw new Error(`Unknown email provider: ${providerType}`);
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
