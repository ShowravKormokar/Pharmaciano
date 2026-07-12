"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ExpiryAlertList from "@/components/inventory-batch/ExpiryAlertList";

export default function ExpiryAlertsPage() {
    const router = useRouter();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Expiry Alerts</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor expired and soon‑to‑expire medicine batches
                    </p>
                </div>
                <Button variant="outline" onClick={() => router.back()}>Back</Button>
            </div>
            <ExpiryAlertList />
        </div>
    );
}