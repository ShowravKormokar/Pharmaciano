"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMedicineStore } from "@/store/medicine.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pill, Eye, PlusCircle } from "lucide-react";

export default function MedicineOverviewPage() {
    const router = useRouter();
    const { medicines, fetchMedicines, loading } = useMedicineStore();
    const [metrics, setMetrics] = useState({ total: 0, active: 0, inactive: 0 });

    useEffect(() => {
        fetchMedicines();
    }, [fetchMedicines]);

    useEffect(() => {
        if (medicines.length) {
            const active = medicines.filter((m) => m.isActive).length;
            setMetrics({
                total: medicines.length,
                active,
                inactive: medicines.length - active,
            });
        }
    }, [medicines]);

    const recentMedicines = [...medicines]
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        })
        .slice(0, 5);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Medicine Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your pharmaceutical products.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    title="Total Medicines"
                    value={metrics.total}
                    icon={<Pill className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Active Medicines"
                    value={metrics.active}
                    icon={<Pill className="h-5 w-5 text-green-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Inactive Medicines"
                    value={metrics.inactive}
                    icon={<Pill className="h-5 w-5 text-red-600" />}
                    loading={loading}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/inventory/medicines/list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Medicine List
                    </Button>
                </Link>
                <Link href="/dashboard/inventory/medicines/add">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Medicine
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recently Added Medicines</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : recentMedicines.length > 0 ? (
                        <div className="space-y-3">
                            {recentMedicines.map((med) => (
                                <div
                                    key={med._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium capitalize">{med.name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {med.genericName} | {med.dosageForm} {med.strength}{med.unit}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${med.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {med.isActive ? "Active" : "Inactive"}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                router.push(`/dashboard/inventory/medicines/view/${med._id}`)
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No medicines found.</p>
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