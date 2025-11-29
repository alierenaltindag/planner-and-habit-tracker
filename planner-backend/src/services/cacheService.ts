import redisClient from '../config/redis';
import { logger } from '../utils/logger';

export class CacheService {
    private static defaultTTL = 3600; // 1 hour

    static async get<T>(key: string): Promise<T | null> {
        try {
            const data = await redisClient.get(key);
            if (data) {
                logger.debug(`Cache HIT for key: ${key}`);
                return JSON.parse(data) as T;
            }
            logger.debug(`Cache MISS for key: ${key}`);
            return null;
        } catch (error) {
            logger.error(`Error getting cache key: ${key}`, { error });
            return null;
        }
    }

    static async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
        try {
            await redisClient.set(key, JSON.stringify(value), { EX: ttl });
            logger.debug(`Cache SET for key: ${key}`);
        } catch (error) {
            logger.error(`Error setting cache key: ${key}`, { error });
        }
    }

    static async del(key: string): Promise<void> {
        try {
            await redisClient.del(key);
            logger.debug(`Cache DEL for key: ${key}`);
        } catch (error) {
            logger.error(`Error deleting cache key: ${key}`, { error });
        }
    }

    static async delPattern(pattern: string): Promise<void> {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
                logger.debug(`Cache DEL pattern: ${pattern}, count: ${keys.length}`);
            }
        } catch (error) {
            logger.error(`Error deleting cache pattern: ${pattern}`, { error });
        }
    }

    static async getOrSet<T>(key: string, handler: () => Promise<T>, ttl: number = this.defaultTTL): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached) return cached;

        const value = await handler();
        if (value) {
            await this.set(key, value, ttl);
        }
        return value;
    }

    static generateKey(prefix: string, identifier: string): string {
        return `${prefix}:${identifier}`;
    }
}
