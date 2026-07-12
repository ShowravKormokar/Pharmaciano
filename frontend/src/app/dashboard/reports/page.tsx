"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSaleStore } from "@/store/sale.store";
import { usePurchaseStore } from "@/store/purchase.store";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { useMedicineStore } from "@/store/medicine.store";
import {
    getSalesOverview,
    getPurchaseOverview,
    getInventoryOverview,
    getProfitLossOverview,
    SalesOverview,
    PurchaseOverview,
    InventoryOverview,
    ProfitLossOverview,
} from "@/lib/reportHelper";
import {
    TrendingUp,
    ShoppingCart,
    Package,
    DollarSign,
    ArrowUpRight,
} from "lucide-react";

interface OverviewData {
    sales: SalesOverview | null;
    purchase: PurchaseOverview | null;
    inventory: InventoryOverview | null;
    profitLoss: ProfitLossOverview | null;
}

export default function ReportsOverviewPage() {
    const { sales, fetchSales, loading: salesLoading } = useSaleStore();
    const { purchases, fetchPurchases, loading: purchaseLoading } = usePurchaseStore();
    const { batches, fetchBatches, loading: batchLoading } = useInventoryBatchStore();
    const { fetchMedicines, loading: medLoading } = useMedicineStore();

    const [data, setData] = useState<OverviewData>({
        sales: null,
        purchase: null,
        inventory: null,
        profitLoss: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchSales(), fetchPurchases(), fetchBatches(), fetchMedicines()]);
            setLoading(false);
        };
        loadData();
    }, [fetchSales, fetchPurchases, fetchBatches, fetchMedicines]);

    useEffect(() => {
        if (!salesLoading && !purchaseLoading && !batchLoading && !medLoading) {
            setData({
                sales: getSalesOverview(sales),
                purchase: getPurchaseOverview(purchases),
                inventory: getInventoryOverview(batches),
                profitLoss: getProfitLossOverview(sales, purchases),
            });
        }
    }, [sales, purchases, batches, salesLoading, purchaseLoading, batchLoading, medLoading]);

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72 mt-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-4 w-24 mt-2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    const reportCards = [
        {
            title: "Sales Report",
            description: "Revenue, orders, top products",
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            href: "/dashboard/reports/sales",
            metrics: [
                { label: "Total Revenue", value: `TK. ${data.sales?.totalRevenue.toFixed(2) || 0}/-` },
                { label: "Orders", value: data.sales?.totalOrders || 0 },
                { label: "Avg Order", value: `TK. ${data.sales?.averageOrderValue.toFixed(2) || 0}/-` },
            ],
        },
        {
            title: "Purchase Report",
            description: "Spending, suppliers, order status",
            icon: ShoppingCart,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            href: "/dashboard/reports/purchase",
            metrics: [
                { label: "Total Spent", value: `TK. ${data.purchase?.totalSpent.toFixed(2) || 0}/-` },
                { label: "Orders", value: data.purchase?.totalOrders || 0 },
                { label: "Avg Order", value: `TK. ${data.purchase?.averageOrderValue.toFixed(2) || 0}/-` },
            ],
        },
        {
            title: "Inventory Valuation",
            description: "Current stock value and items",
            icon: Package,
            color: "text-green-600",
            bgColor: "bg-green-100",
            href: "/dashboard/reports/inventory",
            metrics: [
                { label: "Total Items", value: data.inventory?.totalItems || 0 },
                { label: "Total Value", value: `TK. ${data.inventory?.totalValue.toFixed(2) || 0}/-` },
            ],
        },
        {
            title: "Profit & Loss",
            description: "Income, expenses, net profit",
            icon: DollarSign,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            href: "/dashboard/reports/profit-loss",
            metrics: [
                { label: "Income", value: `TK. ${data.profitLoss?.totalIncome.toFixed(2) || 0}/-` },
                { label: "Expenses", value: `TK. ${data.profitLoss?.totalExpenses.toFixed(2) || 0}/-` },
                { label: "Net Profit", value: `TK. ${data.profitLoss?.netProfit.toFixed(2) || 0}/-` },
            ],
        },
    ];

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Reports Overview</h1>
                <p className="text-muted-foreground mt-1">
                    View key metrics and access detailed reports
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.title} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{card.title}</CardTitle>
                                    <div className={`p-2 rounded-full ${card.bgColor}`}>
                                        <Icon className={`h-5 w-5 ${card.color}`} />
                                    </div>
                                </div>
                                <CardDescription>{card.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {card.metrics.map((metric, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{metric.label}</span>
                                        <span className="font-medium">{metric.value}</span>
                                    </div>
                                ))}
                                <Link href={card.href}>
                                    <Button variant="outline" className="w-full mt-2">
                                        View Report
                                        <ArrowUpRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}