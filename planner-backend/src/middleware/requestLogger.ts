import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { context } from '../utils/context';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const contextId = (req.headers['x-request-id'] as string) || uuidv4();

    context.run(new Map(), () => {
        const store = context.getStore();
        if (store) {
            store.set('contextId', contextId);
        }

        // Log the incoming request
        logger.debug(`Incoming ${req.method} request to ${req.originalUrl}`, {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('user-agent'),
        });

        // Capture response finish to log duration/status
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.debug(`Request completed`, {
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                duration: `${duration}ms`,
            });
        });

        next();
    });
};
