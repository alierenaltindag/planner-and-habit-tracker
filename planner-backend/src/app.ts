import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { env } from './config/env';
import { connectRedis } from './config/redis';
import { logger } from './utils/logger';

const app = express();
const PORT = env.PORT;

// Initialize Redis
connectRedis();

// Middleware (before better-auth)
app.use(helmet());
app.use(cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
}));
app.use(requestLogger);

// Better Auth handler (MUST be before express.json())
app.all('/api/auth/*splat', toNodeHandler(auth));

// JSON parsing (after better-auth)
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

export default app;
