"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePurchaseStore } from "@/store/purchase.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Eye, PlusCircle, TrendingUp, Package, Clock, CheckCircle, Truck } from "lucide-react";

export default function PurchaseOverviewPage() {
    const router = useRouter();
    const { purchases, stats, fetchPurchases, loading } = usePurchaseStore();
    const [metrics, setMetrics] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        received: 0,
    });

    useEffect(() => {
        // Fetch purchases with pagination to get stats (the store already fetches stats)
        fetchPurchases({ page: 1, limit: 5 });
    }, [fetchPurchases]);

    useEffect(() => {
        setMetrics({
            total: stats.pending + stats.approved + stats.received,
            pending: stats.pending,
            approved: stats.approved,
            received: stats.received,
        });
    }, [stats]);

    // Recent purchases (last 5)
    const recentPurchases = [...purchases]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Purchase Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Manage purchase orders, approvals, and inventory receipts.
                </p>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Purchases"
                    value={metrics.total}
                    icon={<ShoppingCart className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Pending Approval"
                    value={metrics.pending}
                    icon={<Clock className="h-5 w-5 text-yellow-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Approved"
                    value={metrics.approved}
                    icon={<CheckCircle className="h-5 w-5 text-blue-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Received"
                    value={metrics.received}
                    icon={<Truck className="h-5 w-5 text-green-600" />}
                    loading={loading}
                />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/purchase/new-purchase">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Purchase Order
                    </Button>
                </Link>
                <Link href="/dashboard/purchase/purchase-list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View All Purchases
                    </Button>
                </Link>
                <Link href="/dashboard/purchase/approvals">
                    <Button variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approvals ({metrics.pending})
                    </Button>
                </Link>
                <Link href="/dashboard/purchase/purchase-return-list">
                    <Button variant="outline">
                        <Package className="h-4 w-4 mr-2" />
                        Purchase Returns
                    </Button>
                </Link>
            </div>

            {/* Recent Purchases */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Purchase Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : recentPurchases.length > 0 ? (
                        <div className="space-y-3">
                            {recentPurchases.map((purchase) => (
                                <div
                                    key={purchase._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">{purchase.purchaseNo}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Supplier: {purchase.supplierId.name} | Total: TK. {purchase.totalAmount.toFixed(2)}/-
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${purchase.status === 'pending'
                                                ? "bg-yellow-100 text-yellow-700"
                                                : purchase.status === 'approved'
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {purchase.status === 'pending' ? 'Pending' : purchase.status === 'approved' ? 'Approved' : 'Received'}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.push(`/dashboard/purchase/view/${purchase._id}`)}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No purchase orders found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// Helper component for metric cards
function MetricCard({ title, value, icon, loading }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-16" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    );
};