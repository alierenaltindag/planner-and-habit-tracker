import { createAuthClient } from "better-auth/react";
import { polarClient } from "./polar-plugin";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/auth",
    plugins: [polarClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

export const syncSubscription = async () => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync-subscription`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
};
