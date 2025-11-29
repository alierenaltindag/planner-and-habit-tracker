import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";
import { env } from "../config/env";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // Use pg provider for PostgreSQL syntax
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: env.CORS_ORIGINS,
    rateLimit: {
        enabled: true,
        modelName: "rate_limit",
        window: 60,
        max: 100,
        customRules: {
            "/sign-in/email": {
                window: 60,
                max: 5,
            },
            "/sign-up/email": {
                window: 60,
                max: 3,
            },
        },
    },
});
