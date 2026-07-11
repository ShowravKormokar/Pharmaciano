"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSaleStore } from "@/store/sale.store";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";
import { DollarSign, ShoppingCart, Package, AlertCircle } from "lucide-react";
import { getTodaySales, getTodayOrders, getLowStockItems, getTopProducts } from "@/lib/dashboardHelpers";

export default function MetricsCards() {
    const { user } = useAuthStore();
    const isSuper = isSuperAdmin(user?.email);
    const { sales, fetchSales, loading: salesLoading } = useSaleStore();
    const { batches, fetchBatches, loading: batchesLoading } = useInventoryBatchStore();
    const [metrics, setMetrics] = useState({
        todaySales: 0,
        todayOrders: 0,
        lowStock: 0,
        topProduct: "N/A",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchSales(), fetchBatches()]);
            setLoading(false);
        };
        loadData();
    }, [fetchSales, fetchBatches]);

    useEffect(() => {
        if (!salesLoading && !batchesLoading) {
            const todaySales = getTodaySales(sales);
            const todayOrders = getTodayOrders(sales);
            const lowStockItems = getLowStockItems(batches, 10);
            const topProducts = getTopProducts(sales, 1);
            setMetrics({
                todaySales,
                todayOrders,
                lowStock: lowStockItems.length,
                topProduct: topProducts.length > 0 ? topProducts[0].name : "N/A",
            });
        }
    }, [sales, batches, salesLoading, batchesLoading]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-8 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const stats = [
        {
            label: "Today's Revenue",
            value: `TK. ${metrics.todaySales.toFixed(2)}/-`,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            label: "Today's Orders",
            value: metrics.todayOrders.toString(),
            icon: ShoppingCart,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            label: "Low Stock Items",
            value: metrics.lowStock.toString(),
            icon: Package,
            color: "text-red-600",
            bgColor: "bg-red-100",
        },
        {
            label: "Top Selling Medicine",
            value: metrics.topProduct,
            icon: AlertCircle,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}