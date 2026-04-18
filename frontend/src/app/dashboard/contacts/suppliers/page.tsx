"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSupplierStore } from "@/store/supplier.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck, Eye, PlusCircle } from "lucide-react";

export default function SupplierOverviewPage() {
    const router = useRouter();
    const { suppliers, fetchSuppliers, loading } = useSupplierStore();
    const [metrics, setMetrics] = useState({ total: 0, active: 0, inactive: 0 });

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    useEffect(() => {
        if (suppliers.length) {
            const active = suppliers.filter((s) => s.isActive).length;
            setMetrics({
                total: suppliers.length,
                active,
                inactive: suppliers.length - active,
            });
        }
    }, [suppliers]);

  const recentSuppliers = [...suppliers]
    .sort((a, b) => {
        const dateA = a.createdAt ?? "";
        const dateB = b.createdAt ?? "";
        return dateA > dateB ? -1 : 1;
    })
    .slice(0, 5);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Supplier Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your suppliers and their contact details.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    title="Total Suppliers"
                    value={metrics.total}
                    icon={<Truck className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Active Suppliers"
                    value={metrics.active}
                    icon={<Truck className="h-5 w-5 text-green-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Inactive Suppliers"
                    value={metrics.inactive}
                    icon={<Truck className="h-5 w-5 text-red-600" />}
                    loading={loading}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/contacts/suppliers/list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Supplier List
                    </Button>
                </Link>
                <Link href="/dashboard/contacts/suppliers/add">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Supplier
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recently Added Suppliers</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : recentSuppliers.length > 0 ? (
                        <div className="space-y-3">
                            {recentSuppliers.map((supplier) => (
                                <div
                                    key={supplier._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium capitalize">{supplier.name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {supplier.contactPerson ? `${supplier.contactPerson} • ` : ""}
                                            {supplier.phone || supplier.email || "No contact"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${supplier.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {supplier.isActive ? "Active" : "Inactive"}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                router.push(`/dashboard/contacts/suppliers/view/${supplier._id}`)
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No suppliers found.</p>
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
                {loading ? (
                    <Skeleton className="h-8 w-16" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    );
}