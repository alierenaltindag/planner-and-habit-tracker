import { betterAuth } from "better-auth";
import { createAuthEndpoint, sessionMiddleware, createAuthMiddleware } from "better-auth/api";
import { eq } from "drizzle-orm";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";
import { env } from "../config/env";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

const polarClient = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN,
    server: 'sandbox',
});

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // Use pg provider for PostgreSQL syntax
        schema: schema,
    }),
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "043d4914-886e-4ead-90fb-0e9d4fa70fcb",
                            slug: "pro"
                        }
                    ],
                    successUrl: `${env.FRONTEND_URL}/dashboard/success?checkout_id={CHECKOUT_ID}`,
                    authenticatedUsersOnly: true
                }),
                portal(),
                webhooks({
                    secret: env.POLAR_WEBHOOK_SECRET,
                    onOrderPaid: async (payload: any) => {
                        const order = payload.data || payload;
                        console.log("Order paid", order)
                        if (order.customer.externalId) {
                            await db.update(schema.user)
                                .set({
                                    plan: "pro",
                                    polarCustomerId: order.customer.id
                                })
                                .where(eq(schema.user.id, order.customer.externalId));
                        } else if (order.customer.id) {
                            await db.update(schema.user)
                                .set({ plan: "pro" })
                                .where(eq(schema.user.polarCustomerId, order.customer.id));
                        }
                    },
                    onSubscriptionCreated: async (payload: any) => {
                        const subscription = payload.data || payload;
                        console.log("Subscription created", subscription)
                        if (subscription.customer.externalId) {
                            await db.update(schema.user)
                                .set({
                                    plan: "pro",
                                    polarCustomerId: subscription.customer.id,
                                    polarSubscriptionId: subscription.id
                                })
                                .where(eq(schema.user.id, subscription.customer.externalId));
                        } else if (subscription.customer.id) {
                            await db.update(schema.user)
                                .set({
                                    plan: "pro",
                                    polarSubscriptionId: subscription.id
                                })
                                .where(eq(schema.user.polarCustomerId, subscription.customer.id));
                        }
                    },
                    onSubscriptionRevoked: async (payload: any) => {
                        const subscription = payload.data || payload;
                        console.log("Subscription revoked", subscription)
                        // Revoke access when subscription is fully revoked (expired)
                        if (subscription.customer.externalId) {
                            await db.update(schema.user)
                                .set({
                                    plan: "free",
                                    polarSubscriptionId: null
                                })
                                .where(eq(schema.user.polarCustomerId, subscription.customer.id));
                        }
                    },
                    onSubscriptionCanceled: async (payload: any) => {
                        // Log cancellation, but do not revoke access yet
                        // Access is revoked on subscription.revoked (at period end)
                        console.log("Subscription canceled:", payload);
                    }
                })
            ],
        }),
        {
            id: "sync-subscription",
            endpoints: {
                syncSubscription: createAuthEndpoint("/sync-subscription", {
                    method: "POST",
                    use: [sessionMiddleware]
                }, async (ctx) => {
                    const session = ctx.context.session;
                    if (!session) {
                        return ctx.json({ success: false, error: "Unauthorized" }, { status: 401 });
                    }
                    const { syncSubscriptionStatus } = await import("./sync-subscription");
                    const result = await syncSubscriptionStatus(session.user.id);
                    return ctx.json(result);
                })
            }
        }
    ],
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.context.newSession) {
                const { syncSubscriptionStatus } = await import("./sync-subscription");
                await syncSubscriptionStatus(ctx.context.newSession.user.id);
            }
        })
    },
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
