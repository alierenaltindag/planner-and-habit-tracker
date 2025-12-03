"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth"
import { toast } from "sonner"

export function PricingCard() {
    const handleCheckout = async () => {
        try {
            // @ts-ignore - checkout is added by the plugin
            await authClient.checkout({
                slug: "pro"
            })
        } catch (error) {
            toast.error("Failed to start checkout")
            console.error(error)
        }
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Pro Plan</CardTitle>
                <CardDescription>Unlock all features</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <p>Everything in Free, plus:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li>Unlimited habits</li>
                        <li>Advanced analytics</li>
                        <li>Priority support</li>
                    </ul>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleCheckout} className="w-full">Upgrade to Pro</Button>
            </CardFooter>
        </Card>
    )
}
