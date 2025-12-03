"use client"

import { useSession, authClient, syncSubscription } from "@/lib/auth"
import { toast } from "sonner";
import { Button } from "@/components/ui/button"

export function UserGreeting() {
    const { data: session } = useSession()

    if (!session) return null

    const handleSyncSubscription = async () => {
        toast.promise(
            syncSubscription(),
            {
                loading: 'Syncing subscription...',
                success: 'Subscription synced!',
                error: 'Failed to sync subscription'
            }
        );
    }

    return (
        <div className="flex items-center gap-4">
            <p>Welcome, {session.user.name || session.user.email}</p>
            <Button onClick={() =>
                // @ts-ignore
                authClient.portal()
            }>
                Manage Subscription
            </Button>
            <Button
                variant="outline"
                onClick={handleSyncSubscription}
            >
                Sync Subscription
            </Button>
        </div>
    )
}
