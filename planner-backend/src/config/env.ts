import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
    DATABASE_URL: z.string().url().describe('PostgreSQL Connection URL'),
    REDIS_URL: z.string().url().default('redis://localhost:6379').describe('Redis Connection URL'),
    CORS_ORIGINS: z.string().default('http://localhost:3000').transform((val) => val.split(',').map((origin) => origin.trim())),
    FRONTEND_URL: z.string().url().default('http://localhost:3000').describe('Frontend Base URL'),
    BETTER_AUTH_SECRET: z.string().min(32).describe('Better Auth Secret Key'),
    BETTER_AUTH_URL: z.string().url().describe('Better Auth Base URL'),
    POLAR_ACCESS_TOKEN: z.string().min(1).describe('Polar Access Token'),
    POLAR_WEBHOOK_SECRET: z.string().min(1).describe('Polar Webhook Secret'),
    JWT_SECRET: z.string().min(10).describe('JWT Secret Key'),
    COOKIE_DOMAIN: z.string().default('localhost'),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    EMAIL_PROVIDER: z.enum(['resend', 'sendgrid']).default('resend'),
    RESEND_API_KEY: z.string().min(1).describe('Resend API Key'),
    EMAIL_DEFAULT_FROM: z.string().min(1).describe('Default From Email'),
    EMAIL_MAX_RETRIES: z.string().default('3').transform((val) => parseInt(val, 10)),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 2));
    process.exit(1);
}

export const env = parsedEnv.data;
