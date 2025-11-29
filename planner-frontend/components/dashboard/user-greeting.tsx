"use client"

import { useSession } from "@/lib/auth"

export function UserGreeting() {
    const { data: session, isPending } = useSession()

    if (isPending) return <p>Loading...</p>
    if (!session?.user) return null

    return <p>Welcome, {session.user.name || session.user.email}</p>
}
