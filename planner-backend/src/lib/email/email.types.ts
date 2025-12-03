/**
 * Email Library Types
 *
 * Defines the provider-agnostic email service interfaces and types.
 * This allows swapping between different email providers (Resend, SendGrid, etc.)
 * without changing the consuming code.
 */

/**
 * Email attachment interface
 */
export interface EmailAttachment {
  /** Filename of the attachment */
  filename: string;
  /** Buffer content of the attachment */
  content?: Buffer;
  /** URL to download the attachment from */
  path?: string;
  /** Content type (MIME type) */
  contentType?: string;
}

/**
 * Email sending options
 */
export interface SendEmailOptions {
  /** Sender email address (uses default if not specified) */
  from?: string;
  /** Recipient email address(es) */
  to: string | string[];
  /** Email subject */
  subject: string;
  /** Plain text email body */
  text?: string;
  /** HTML email body */
  html?: string;
  /** React component for email template (provider-specific) */
  react?: React.ReactElement;
  /** Reply-to email address */
  replyTo?: string;
  /** CC recipients */
  cc?: string | string[];
  /** BCC recipients */
  bcc?: string | string[];
  /** Email attachments */
  attachments?: EmailAttachment[];
  /** Custom headers */
  headers?: Record<string, string>;
  /** Tags for categorization */
  tags?: Array<{ name: string; value: string }>;
  /** Schedule email for future delivery (ISO 8601 format) */
  scheduledAt?: string;
}

/**
 * Response from sending an email
 */
export interface SendEmailResponse {
  /** Success status */
  success: boolean;
  /** Email ID from the provider */
  emailId?: string;
  /** Error message if failed */
  error?: string;
  /** Additional metadata from the provider */
  metadata?: Record<string, unknown>;
}

/**
 * Email provider interface
 * All email providers must implement this interface
 */
export interface IEmailProvider {
  /**
   * Send an email
   * @param options - Email sending options
   * @returns Promise with send response
   */
  sendEmail(options: SendEmailOptions): Promise<SendEmailResponse>;

  /**
   * Send multiple emails in a batch
   * @param emails - Array of email options
   * @returns Promise with array of send responses
   */
  sendBatch?(emails: SendEmailOptions[]): Promise<SendEmailResponse[]>;

  /**
   * Verify the provider is properly configured
   * @returns Promise with boolean indicating if provider is ready
   */
  verify?(): Promise<boolean>;
}

/**
 * Email provider types
 */
export type EmailProviderType = 'resend' | 'sendgrid' | 'ses';

/**
 * Email service configuration
 */
export interface EmailServiceConfig {
  /** Provider to use */
  provider: EmailProviderType;
  /** API key or credentials for the provider */
  apiKey: string;
  /** Default sender email (optional) */
  defaultFrom?: string;
  /** Enable retry on transient failures */
  enableRetry?: boolean;
  /** Maximum number of retry attempts */
  maxRetries?: number;
}
