"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Users,
    ShoppingCart,
    Package,
    TrendingUp,
    DollarSign,
    Clock,
    Activity,
    AlertCircle,
    ArrowUpRight,
    Calendar,
    BarChart3
} from 'lucide-react'
import Link from 'next/link'
import MetricsCards from '@/components/dashboard/MetricsCards'
import RecentActivity from '@/components/dashboard/RecentActivity'
import SalesAnalytics from '@/components/dashboard/SalesAnalytics'
import { useAuthStore } from '@/store/auth.store'
import { isSuperAdmin } from '@/lib/isSuperAdmin'
import { useSaleStore } from '@/store/sale.store'
import { useEffect, useState } from 'react'
import { getHighestSaleMonth } from '@/lib/dashboardHelpers'
import TopProducts from '@/components/dashboard/TopProducts'

export default function Dashboard() {
    const { user } = useAuthStore();
    const isSuper = isSuperAdmin(user?.email);
    const { sales, fetchSales, loading } = useSaleStore();
    const [monthlyTarget, setMonthlyTarget] = useState(250000); // fallback
    const [highestMonth, setHighestMonth] = useState("");
    // For mock progress, we can compute real monthly progress if needed
    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    useEffect(() => {
        if (sales.length > 0) {
            const highest = getHighestSaleMonth(sales);
            setMonthlyTarget(highest.total);
            setHighestMonth(highest.month);
        }
    }, [sales]);

    // Compute current month's sales
    const currentMonthSales = sales.filter(sale => {
        const date = new Date(sale.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    const totalMonthlySales = currentMonthSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const progress = monthlyTarget > 0 ? Math.min((totalMonthlySales / monthlyTarget) * 100, 100) : 0;
    const isTargetExceeded = totalMonthlySales > monthlyTarget;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back! Here's what's happening with your pharmacy today.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Today
                    </Button> */}
                    <Button size="sm" onClick={() => fetchSales()}>
                        <Activity className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Quick Stats - Now with real data */}
            <MetricsCards />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Stats & Alerts */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Sales Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Overview</CardTitle>
                            <CardDescription>
                                Monthly sales performance
                                {highestMonth && ` | Best Month: ${highestMonth}`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Monthly Target: Higher than previous sale</p>
                                        <p className="text-2xl font-bold">TK. {monthlyTarget.toLocaleString()}/-</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Achieved</p>
                                        <p className={`text-2xl font-bold ${isTargetExceeded ? 'text-green-600' : 'text-foreground'}`}>
                                            TK. {totalMonthlySales.toFixed(2)}/-
                                        </p>
                                    </div>
                                </div>
                                <Progress
                                    value={progress}
                                    className="h-2"
                                    // optional: change color if exceeded
                                    style={{ backgroundColor: isTargetExceeded ? '#fca5a5' : undefined }}
                                />
                                {/* <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Target: TK. {monthlyTarget.toLocaleString()}/-</span>
                                    <span className={isTargetExceeded ? 'text-green-600 font-medium' : ''}>
                                        {isTargetExceeded ? 'Target Exceeded!' : `${progress.toFixed(0)}% Completed`}
                                    </span>
                                </div> */}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <RecentActivity />
                </div>

                {/* Right Column - Quick Info */}
                <div className="space-y-6">
                    <TopProducts />

                    {/* System Alerts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                                System Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                                    <div>
                                        <p className="font-medium text-foreground">Low Stock Items</p>
                                        <p className="text-sm text-muted-foreground">Check inventory for restock</p>
                                    </div>
                                    <Badge variant="outline" className="text-yellow-600">Alert</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                    <div>
                                        <p className="font-medium text-foreground">Pending Orders</p>
                                        <p className="text-sm text-muted-foreground">Process pending sales</p>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/dashboard/sales/sales-list">
                                            Process
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                <Button className="h-auto py-3 flex flex-col items-center justify-center" asChild>
                                    <Link href="/dashboard/sales/pos">
                                        <ShoppingCart className="h-5 w-5 mb-1" />
                                        <span className="text-xs">POS</span>
                                    </Link>
                                </Button>
                                <Button variant="outline" className="h-auto py-3 flex flex-col items-center justify-center" asChild>
                                    <Link href="/dashboard/sales/add-sale">
                                        <Package className="h-5 w-5 mb-1" />
                                        <span className="text-xs">Add Sale</span>
                                    </Link>
                                </Button>
                                <Button variant="outline" className="h-auto py-3 flex flex-col items-center justify-center" asChild>
                                    <Link href="/dashboard/users">
                                        <Users className="h-5 w-5 mb-1" />
                                        <span className="text-xs">Users</span>
                                    </Link>
                                </Button>
                                <Button variant="outline" className="h-auto py-3 flex flex-col items-center justify-center" asChild>
                                    <Link href="/dashboard/sales/sales-list">
                                        <TrendingUp className="h-5 w-5 mb-1" />
                                        <span className="text-xs">Sales Report</span>
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Sales Analytics (Super Admin only) */}
            {isSuper && (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Sales Analytics</h2>
                    <SalesAnalytics />
                </div>
            )}
        </div>
    )
}