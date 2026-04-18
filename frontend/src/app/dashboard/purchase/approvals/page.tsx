"use client";

import { useEffect, useState } from "react";
import { usePurchaseStore } from "@/store/purchase.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PurchaseTable from "@/components/purchase/PurchaseTable";
import PurchaseTableSkeleton from "@/components/purchase/PurchaseTableSkeleton";

export default function ApprovalsPage() {
    const { purchases, loading, fetchPurchases } = usePurchaseStore();
    const [pendingPurchases, setPendingPurchases] = useState<typeof purchases>([]);

    useEffect(() => {
        fetchPurchases({ status: "pending", page: 1, limit: 100 });
    }, [fetchPurchases]);

    useEffect(() => {
        setPendingPurchases(purchases.filter(p => p.status === "pending"));
    }, [purchases]);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Purchase Approvals</h1>
                <p className="text-muted-foreground">Approve pending purchase orders</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Pending Approvals ({pendingPurchases.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? <PurchaseTableSkeleton /> : <PurchaseTable purchases={pendingPurchases} />}
                </CardContent>
            </Card>
        </div>
    );
}