"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSaleStore } from "@/store/sale.store";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";
import {
    getDailySalesData,
    getBranchSalesData,
    getMonthlySalesData,
    getTopProducts,
} from "@/lib/dashboardHelpers";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

export default function SalesAnalytics() {
    const { user } = useAuthStore();
    const isSuper = isSuperAdmin(user?.email);
    const { sales, fetchSales, loading } = useSaleStore();
    const [dailyData, setDailyData] = useState<any[]>([]);
    const [branchData, setBranchData] = useState<any[]>([]);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (isSuper) {
            const loadData = async () => {
                setDataLoading(true);
                await fetchSales();
                setDataLoading(false);
            };
            loadData();
        }
    }, [isSuper, fetchSales]);

    useEffect(() => {
        if (!loading && sales.length > 0) {
            setDailyData(getDailySalesData(sales, 30));
            setBranchData(getBranchSalesData(sales));
            setMonthlyData(getMonthlySalesData(sales, 6));
            setTopProducts(getTopProducts(sales, 5));
        }
    }, [sales, loading]);

    if (!isSuper) {
        return null;
    }

    if (dataLoading || loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-56" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-48 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Sales Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Sales (Last 30 Days)</CardTitle>
                    <CardDescription>Revenue trend</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={dailyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                            <YAxis />
                            <Tooltip formatter={(value) => `TK. ${Number(value).toFixed(2)}/-`} />
                            <Line type="monotone" dataKey="total" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Branch-wise Sales */}
            <Card>
                <CardHeader>
                    <CardTitle>Branch-wise Sales</CardTitle>
                    <CardDescription>Revenue by branch</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={branchData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="branch" tick={{ fontSize: 10 }} />
                            <YAxis />
                            <Tooltip formatter={(value) => `TK. ${Number(value).toFixed(2)}/-`} />
                            <Bar dataKey="total" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Monthly Sales Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Sales Trend</CardTitle>
                    <CardDescription>Revenue over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis />
                            <Tooltip formatter={(value) => `TK. ${Number(value).toFixed(2)}/-`} />
                            <Bar dataKey="total" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                    <CardDescription>By quantity sold</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={topProducts} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
                            <Tooltip />
                            <Bar dataKey="quantity" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}