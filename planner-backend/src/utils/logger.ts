import winston from 'winston';
import { getContext } from './context';
import { env } from '../config/env';

const { combine, timestamp, json, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp, ...meta }) => {
    const contextId = getContext('contextId') || 'N/A';
    return `${timestamp} [${contextId}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

export const logger = winston.createLogger({
    level: env.LOG_LEVEL,
    format: combine(
        timestamp(),
        json() // Use JSON for production/maintainability
    ),
    defaultMeta: { service: 'planner-backend' },
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                customFormat // Readable format for console
            ),
        }),
        // Add file transport if needed
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
});