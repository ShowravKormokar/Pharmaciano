"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSaleStore } from "@/store/sale.store";
import { getTopProducts, filterSalesByDateRange } from "@/lib/dashboardHelpers";
import { subDays, startOfDay, endOfDay } from "date-fns";

export default function TopProducts() {
    const { sales, fetchSales, loading } = useSaleStore();
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchSales();
            setIsLoading(false);
        };
        loadData();
    }, [fetchSales]);

    useEffect(() => {
        if (!loading && sales.length > 0) {
            // Filter sales for the last 7 days
            const now = new Date();
            const start = startOfDay(subDays(now, 7));
            const end = endOfDay(now);
            const weeklySales = filterSalesByDateRange(sales, start, end);
            const products = getTopProducts(weeklySales, 5);
            setTopProducts(products);
        } else {
            setTopProducts([]);
        }
    }, [sales, loading]);

    if (isLoading || loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Best sellers this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div>
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <div className="text-right">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    ))}
                    <Separator className="my-4" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (topProducts.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Best sellers this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">No sales data for the current week.</p>
                    <Separator className="my-4" />
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/dashboard/sales">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Analytics
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best sellers this week</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="font-medium text-foreground">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.quantity} sold</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-foreground">TK. {product.revenue.toFixed(2)}/-</p>
                                <Badge variant="outline" className="text-xs">
                                    Revenue
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
                <Separator className="my-4" />
                {/* <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/sales">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                    </Link>
                </Button> */}
            </CardContent>
        </Card>
    );
}