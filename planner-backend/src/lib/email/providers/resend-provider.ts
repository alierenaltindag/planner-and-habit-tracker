import { Resend } from 'resend';
import { logger } from '@/lib/logger';
import 'server-only';
import type { IEmailProvider, SendEmailOptions, SendEmailResponse } from '../email.types';

/**
 * Resend Email Provider
 *
 * Implementation of the email provider interface using Resend.
 * Handles email sending with retry logic for transient failures.
 */
export class ResendProvider implements IEmailProvider {
  private client: Resend;
  private maxRetries: number;

  constructor(apiKey: string, maxRetries = 3) {
    this.client = new Resend(apiKey);
    this.maxRetries = maxRetries;
  }

  /**
   * Send an email using Resend
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResponse> {
    return this.sendWithRetry(options, this.maxRetries);
  }

  /**
   * Send multiple emails in a batch
   */
  async sendBatch(emails: SendEmailOptions[]): Promise<SendEmailResponse[]> {
    try {
      // Map our generic options to Resend format
      const resendEmails = emails.map((email) => this.mapToResendFormat(email));

      const { data, error } = await this.client.batch.send(resendEmails);

      if (error) {
        logger.error('Resend batch send failed', { error });
        return emails.map(() => ({
          success: false,
          error: error.message || 'Batch send failed',
        }));
      }

      // Map responses
      return (
        data?.data.map((item) => ({
          success: true,
          emailId: item.id,
        })) || []
      );
    } catch (error) {
      logger.error('Resend batch send error', { error });
      return emails.map(() => ({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }

  /**
   * Verify the Resend provider is configured correctly
   */
  async verify(): Promise<boolean> {
    try {
      // Try to list domains as a verification check
      const { error } = await this.client.domains.list({ limit: 1 });
      if (error) {
        logger.error('Resend verification failed', { error });
        return false;
      }
      return true;
    } catch (error) {
      logger.error('Resend verification error', { error });
      return false;
    }
  }

  /**
   * Send email with retry logic for transient failures
   */
  private async sendWithRetry(
    options: SendEmailOptions,
    retriesLeft: number,
  ): Promise<SendEmailResponse> {
    try {
      // Map our generic options to Resend format
      const resendOptions = this.mapToResendFormat(options);

      const { data, error } = await this.client.emails.send(resendOptions);

      if (error) {
        // Handle specific error types
        if (error.name === 'validation_error' || error.name === 'missing_required_field') {
          logger.error('Resend validation error - not retrying', {
            error,
            options,
          });
          return {
            success: false,
            error: error.message || 'Validation error',
          };
        }

        // Retry on application errors if retries are left
        if (error.name === 'application_error' && retriesLeft > 0) {
          logger.warn(`Resend send failed, retrying... (${retriesLeft} left)`, {
            error,
          });
          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (this.maxRetries - retriesLeft + 1)),
          );
          return this.sendWithRetry(options, retriesLeft - 1);
        }

        logger.error('Resend send failed', { error, options });
        return {
          success: false,
          error: error.message || 'Failed to send email',
        };
      }

      logger.info('Email sent successfully', { emailId: data?.id });
      return {
        success: true,
        emailId: data?.id,
      };
    } catch (error) {
      logger.error('Resend send error', { error, options });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Map our generic email options to Resend-specific format
   */
  private mapToResendFormat(options: SendEmailOptions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resendOptions: any = {
      from: options.from,
      to: options.to,
      subject: options.subject,
    };

    if (options.text) resendOptions.text = options.text;
    if (options.html) resendOptions.html = options.html;
    if (options.react) resendOptions.react = options.react;
    if (options.replyTo) resendOptions.replyTo = options.replyTo;
    if (options.cc) resendOptions.cc = options.cc;
    if (options.bcc) resendOptions.bcc = options.bcc;
    if (options.attachments) resendOptions.attachments = options.attachments;
    if (options.headers) resendOptions.headers = options.headers;
    if (options.tags) resendOptions.tags = options.tags;
    if (options.scheduledAt) resendOptions.scheduledAt = options.scheduledAt;

    return resendOptions;
  }
}
