"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSaleStore } from "@/store/sale.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Eye, PlusCircle, TrendingUp } from "lucide-react";

export default function SalesOverviewPage() {
    const router = useRouter();
    const { sales, fetchSales, loading } = useSaleStore();
    const [metrics, setMetrics] = useState({
        totalSales: 0,
        totalAmount: 0,
        averageAmount: 0,
    });

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    useEffect(() => {
        if (sales.length) {
            const total = sales.reduce((sum, s) => sum + s.totalAmount, 0);
            setMetrics({
                totalSales: sales.length,
                totalAmount: total,
                averageAmount: total / sales.length,
            });
        }
    }, [sales]);

    const recentSales = [...sales]
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .slice(0, 5);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Sales Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Track sales performance and manage transactions.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    title="Total Sales"
                    value={metrics.totalSales}
                    icon={<ShoppingCart className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Total Revenue"
                    value={`TK. ${metrics.totalAmount.toLocaleString()}/-`}
                    icon={<TrendingUp className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Average Sale"
                    value={`TK. ${metrics.averageAmount.toFixed(2)}/-`}
                    icon={<ShoppingCart className="h-5 w-5" />}
                    loading={loading}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/sales/pos">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Sale (POS)
                    </Button>
                </Link>
                <Link href="/dashboard/sales/sales-list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Sales List
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : recentSales.length > 0 ? (
                        <div className="space-y-3">
                            {recentSales.map((sale) => (
                                <div
                                    key={sale._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">{sale.invoiceNo}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {sale.customerName || "Walk-in"} | {sale.paymentMethod}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold">
                                            TK. {sale.totalAmount.toFixed(2)}/-
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                router.push(`/dashboard/sales/view/${sale._id}`)
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No sales recorded.</p>
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