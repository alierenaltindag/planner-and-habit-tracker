import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
    DATABASE_URL: z.string().url().describe('PostgreSQL Connection URL'),
    REDIS_URL: z.string().url().default('redis://localhost:6379').describe('Redis Connection URL'),
    CORS_ORIGINS: z.string().default('http://localhost:3000').transform((val) => val.split(',').map((origin) => origin.trim())),
    BETTER_AUTH_SECRET: z.string().min(32).describe('Better Auth Secret Key'),
    BETTER_AUTH_URL: z.string().url().describe('Better Auth Base URL'),
    JWT_SECRET: z.string().min(10).describe('JWT Secret Key'),
    COOKIE_DOMAIN: z.string().default('localhost'),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 2));
    process.exit(1);
}

export const env = parsedEnv.data;
