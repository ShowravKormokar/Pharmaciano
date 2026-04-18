"use client";

import { useEffect, useState } from "react";
import { usePurchaseStore } from "@/store/purchase.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PurchaseTable from "@/components/purchase/PurchaseTable";
import PurchaseTableSkeleton from "@/components/purchase/PurchaseTableSkeleton";
import { RefreshCcw } from "lucide-react";

export default function ApprovalsPage() {
    const { purchases, loading, fetchPurchases } = usePurchaseStore();
    const [pendingPurchases, setPendingPurchases] =
        useState<typeof purchases>([]);

    const [refreshing, setRefreshing] = useState(false);

    // initial load
    useEffect(() => {
        fetchPurchases({ status: "pending", page: 1, limit: 100 });
    }, [fetchPurchases]);

    // filter safe state
    useEffect(() => {
        setPendingPurchases(
            purchases.filter((p) => p.status === "pending")
        );
    }, [purchases]);

    // 🔄 FIXED REFRESH LOGIC
    const handleRefresh = async () => {
        setRefreshing(true);

        await fetchPurchases({
            status: "pending",
            page: 1,
            limit: 100,
        });

        setRefreshing(false);
    };

    return (
        <div className="p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Purchase Approvals
                    </h1>
                    <p className="text-muted-foreground">
                        Approve pending purchase orders
                    </p>
                </div>

                {/* Refresh Button */}
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={loading || refreshing}
                >
                    <RefreshCcw
                        className={`h-4 w-4 mr-2 ${loading || refreshing
                                ? "animate-spin"
                                : ""
                            }`}
                    />
                    Refresh
                </Button>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Pending Approvals ({pendingPurchases.length})
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <PurchaseTableSkeleton />
                    ) : (
                        <PurchaseTable
                            purchases={pendingPurchases}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}