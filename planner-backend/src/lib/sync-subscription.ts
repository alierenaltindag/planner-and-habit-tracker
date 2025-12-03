import { Polar } from "@polar-sh/sdk";
import { env } from "../config/env";
import { db } from "../db";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger";

const polar = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN,
    server: "sandbox", // TODO: Make this configurable based on env
});

export async function syncSubscriptionStatus(userId: string) {
    try {
        logger.info(`Syncing subscription for user ${userId}`);
        // List active subscriptions for the user using their internal ID as external_customer_id
        const result = await polar.subscriptions.list({
            externalCustomerId: userId,
            active: true,
            limit: 1,
            page: 1,
        });

        const subscriptions = result.result.items;

        if (subscriptions && subscriptions.length > 0) {
            const subscription = subscriptions[0];
            if (subscription) {

                await db.update(schema.user)
                    .set({
                        plan: "pro",
                        polarCustomerId: subscription.customer.id,
                        polarSubscriptionId: subscription.id,
                    })
                    .where(eq(schema.user.id, userId));

                return { success: true, plan: "pro", subscription };
            }
        }

        await db.update(schema.user)
            .set({
                plan: "free",
                polarSubscriptionId: null,
            })
            .where(eq(schema.user.id, userId));

        logger.info(`Synced subscription for user ${userId}`);

        return { success: true, plan: "free", subscription: null };
    } catch (error) {
        logger.error(`Error syncing subscription for user ${userId}:`, error);
        return { success: false, error };
    }
}
