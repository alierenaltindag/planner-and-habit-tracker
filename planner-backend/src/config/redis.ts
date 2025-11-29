import { createClient } from 'redis';
import { env } from './env';
import { logger } from '../utils/logger';

const redisClient = createClient({
    url: env.REDIS_URL,
});

redisClient.on('error', (err) => {
    logger.error('Redis Client Error', { error: err });
});

redisClient.on('connect', () => {
    logger.info('Redis Client Connected');
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

export default redisClient;
