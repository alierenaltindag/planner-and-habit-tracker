"use client"

import { UserGreeting } from "@/components/dashboard/user-greeting"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PricingCard } from "@/components/dashboard/pricing-card"

export default function DashboardPage() {
    const router = useRouter()
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <UserGreeting />
            <Button onClick={async () => {
                await signOut()
                router.push("/login")
            }}>Logout</Button>
            <div className="mt-8">
                <PricingCard />
            </div>
        </div>
    )
}
