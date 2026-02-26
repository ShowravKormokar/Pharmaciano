"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWarehouseStore } from "@/store/warehouse.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Warehouse, Eye, PlusCircle, MapPin, Building2 } from "lucide-react";

export default function WarehouseOverviewPage() {
    const router = useRouter();
    const { warehouses, fetchWarehouses, loading } = useWarehouseStore();

    const [metrics, setMetrics] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        distinctBranches: 0,
    });

    useEffect(() => {
        fetchWarehouses();
    }, [fetchWarehouses]);

    useEffect(() => {
        if (warehouses.length) {
            const active = warehouses.filter((w) => w.isActive).length;
            const branches = new Set(
                warehouses
                    .map((w) => w.branchId?.name || w.branchName)
                    .filter(Boolean)
            ).size;
            setMetrics({
                total: warehouses.length,
                active,
                inactive: warehouses.length - active,
                distinctBranches: branches,
            });
        }
    }, [warehouses]);

    // Recent warehouses (last 5 by createdAt)
    const recentWarehouses = [...warehouses]
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .slice(0, 5);

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Warehouse Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Monitor warehouse inventory, capacity and branch distribution.
                </p>
            </div>

            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Warehouses"
                    value={metrics.total}
                    icon={<Warehouse className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Active Warehouses"
                    value={metrics.active}
                    icon={<Warehouse className="h-5 w-5 text-green-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Inactive Warehouses"
                    value={metrics.inactive}
                    icon={<Warehouse className="h-5 w-5 text-red-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Branches Served"
                    value={metrics.distinctBranches}
                    icon={<Building2 className="h-5 w-5" />}
                    loading={loading}
                />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/warehouse/list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Warehouse List
                    </Button>
                </Link>
                <Link href="/dashboard/warehouse/add">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Warehouse
                    </Button>
                </Link>
            </div>

            {/* Recent Warehouses */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recently Added Warehouses</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : recentWarehouses.length > 0 ? (
                        <div className="space-y-3">
                            {recentWarehouses.map((warehouse) => (
                                <div
                                    key={warehouse._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20 transition-colors"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">{warehouse.name}</p>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {warehouse.location || "N/A"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Building2 className="h-3.5 w-3.5" />
                                                {warehouse.branchId?.name || warehouse.branchName || "N/A"}
                                            </span>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${warehouse.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {warehouse.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.push(`/dashboard/warehouse/view/${warehouse._id}`)
                                        }
                                    >
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No warehouses found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

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
}