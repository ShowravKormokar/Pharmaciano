"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useSaleStore } from "@/store/sale.store";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { useMedicineStore } from "@/store/medicine.store";
import { getRecentSales, getRecentBatches, getRecentMedicines } from "@/lib/dashboardHelpers";
import { ShoppingCart, Package, Pill, ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

export default function RecentActivity() {
    const { sales, fetchSales, loading: salesLoading } = useSaleStore();
    const { batches, fetchBatches, loading: batchesLoading } = useInventoryBatchStore();
    const { medicines, fetchMedicines, loading: medicinesLoading } = useMedicineStore();
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchSales(), fetchBatches(), fetchMedicines()]);
            setLoading(false);
        };
        loadData();
    }, [fetchSales, fetchBatches, fetchMedicines]);

    useEffect(() => {
        if (!salesLoading && !batchesLoading && !medicinesLoading) {
            const recentSales = getRecentSales(sales, 3);
            const recentBatches = getRecentBatches(batches, 3);
            const recentMedicines = getRecentMedicines(medicines, 3);

            const items = [
                ...recentSales.map(s => ({
                    id: s._id,
                    type: "sale",
                    title: `Sale ${s.invoiceNo}`,
                    description: `Customer: ${s.customerName || "Walk-in"} | Amount: TK. ${s.totalAmount.toFixed(2)}/-`,
                    time: formatDistanceToNow(new Date(s.createdAt), { addSuffix: true }),
                    icon: ShoppingCart,
                    iconColor: "text-green-600",
                    bgColor: "bg-green-100",
                })),
                ...recentBatches.map(b => {
                    const medicineName = typeof b.medicineId === 'object' && b.medicineId?.name
                        ? b.medicineId.name
                        : b.medicineId?.name || "Unknown";
                    return {
                        id: b._id,
                        type: "batch",
                        title: `Batch ${b.batchNo}`,
                        description: `Medicine: ${medicineName} | Qty: ${b.quantity}`,
                        time: formatDistanceToNow(new Date(b.createdAt || Date.now()), { addSuffix: true }),
                        icon: Package,
                        iconColor: "text-blue-600",
                        bgColor: "bg-blue-100",
                    };
                }),
                ...recentMedicines.map(m => ({
                    id: m._id,
                    type: "medicine",
                    title: `Medicine: ${m.name}`,
                    description: `Generic: ${m.genericName || "N/A"} | Category: ${m.categoryName || "N/A"}`,
                    time: formatDistanceToNow(new Date(m.createdAt || Date.now()), { addSuffix: true }),
                    icon: Pill,
                    iconColor: "text-purple-600",
                    bgColor: "bg-purple-100",
                })),
            ].slice(0, 5);

            setActivities(items);
        }
    }, [sales, batches, medicines, salesLoading, batchesLoading, medicinesLoading]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-56" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-3 w-16" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest system activities</CardDescription>
                </div>
                <Link href="/dashboard/sales/sales-list">
                    <Button variant="ghost" size="sm" className="text-primary">
                        View All <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity) => {
                        const Icon = activity.icon;
                        return (
                            <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-accent/50 rounded-lg transition-colors">
                                <div className={`p-2 rounded-full ${activity.bgColor}`}>
                                    <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">{activity.title}</p>
                                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}