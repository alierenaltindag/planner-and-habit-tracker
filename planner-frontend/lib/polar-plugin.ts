import type { BetterAuthClientPlugin } from "better-auth";

export const polarClient = (): BetterAuthClientPlugin => {
    return {
        id: "polar-client",
        getActions: ($fetch) => ({
            checkout: async (data: { slug?: string; products?: string[] }) => {
                const res = await $fetch("/checkout", {
                    method: "POST",
                    body: {
                        ...data,
                        redirect: true,
                    },
                });
                if (res.error) {
                    throw new Error(res.error.message || "Checkout failed");
                }
                const responseData = res.data as { url?: string };
                // If the server returns a URL, redirect to it
                if (responseData?.url) {
                    window.location.href = responseData.url;
                }
                return res.data;
            },
            portal: async () => {
                const res = await $fetch("/customer/portal", {
                    method: "GET",
                });
                if (res.error) {
                    throw new Error(res.error.message || "Portal access failed");
                }
                const responseData = res.data as { url?: string };
                // If the server returns a URL, redirect to it
                if (responseData?.url) {
                    window.location.href = responseData.url;
                }
                return res.data;
            }
        }),
    };
};
