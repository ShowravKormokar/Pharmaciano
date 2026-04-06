"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Eye, PlusCircle } from "lucide-react";

export default function InventoryBatchOverviewPage() {
    const router = useRouter();
    const { batches, total, active, expired, fetchBatches, loading } = useInventoryBatchStore();

    useEffect(() => {
        fetchBatches({ page: 1, limit: 10 }); // fetch first page, but we mainly need totals
    }, [fetchBatches]);

    const recentBatches = [...batches]
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        })
        .slice(0, 5);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Inventory Batch Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Manage medicine batches, track expiry and stock levels.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <MetricCard title="Total Batches" value={total} icon={<Package className="h-5 w-5" />} loading={loading} />
                <MetricCard title="Active" value={active} icon={<Package className="h-5 w-5 text-green-600" />} loading={loading} />
                <MetricCard title="Expired" value={expired} icon={<Package className="h-5 w-5 text-red-600" />} loading={loading} />
                <MetricCard title="Low Stock" value={0} icon={<Package className="h-5 w-5 text-yellow-600" />} loading={loading} />
                {/* Low stock not provided by API, keep 0 or compute from batches if needed */}
            </div>

            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/inventory/inventory-batch/list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Batch List
                    </Button>
                </Link>
                <Link href="/dashboard/inventory/inventory-batch/add">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Batch
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recently Added Batches</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : recentBatches.length > 0 ? (
                        <div className="space-y-3">
                            {recentBatches.map((batch) => (
                                <div
                                    key={batch._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium capitalize">
                                            {typeof batch.medicineId === "object" ? batch.medicineId?.name : batch.medicineId}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Batch: {batch.batchNo} | Qty: {batch.quantity}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${batch.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : batch.status === "expired"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {batch.status === "active" ? "Active" : batch.status === "expired" ? "Expired" : "Low Stock"}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.push(`/dashboard/inventory/inventory-batch/view/${batch._id}`)}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No batches found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function MetricCard({ title, value, icon, loading }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{value}</div>}
            </CardContent>
        </Card>
    );
}