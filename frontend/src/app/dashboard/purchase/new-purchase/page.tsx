"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PurchaseForm from "@/components/purchase/PurchaseForm";

export default function NewPurchasePage() {
    const router = useRouter();
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New Purchase</h1>
                <Button variant="outline" onClick={() => router.back()}>Back</Button>
            </div>
            <PurchaseForm onSuccess={() => router.push("/dashboard/purchase/purchase-list")} />
        </div>
    );
};