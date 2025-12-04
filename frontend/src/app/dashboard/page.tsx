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

export default function Dashboard() {
    // Mock data for demonstration
    const stats = {
        totalUsers: 24,
        todaySales: 8420,
        inventoryItems: 156,
        pendingOrders: 8,
        lowStockItems: 12,
        monthlyTarget: 75, // percentage
    }

    const recentActivities = [
        { id: 1, action: 'New sale completed', user: 'John Doe', amount: 'TK. 2,050/-', time: '2 min ago', type: 'sale' },
        { id: 2, action: 'User registered', user: 'Jane Smith', role: 'Salesman', time: '15 min ago', type: 'user' },
        { id: 3, action: 'Low stock alert', product: 'Paracetamol 500mg', quantity: 5, time: '30 min ago', type: 'alert' },
        { id: 4, action: 'Payment received', customer: 'City Hospital', amount: 'TK. 8,400/-', time: '1 hour ago', type: 'payment' },
        { id: 5, action: 'Inventory updated', user: 'Admin', items: 3, time: '2 hours ago', type: 'inventory' },
    ]

    const quickStats = [
        { label: 'Today\'s Revenue', value: 'TK. 8,420/-', change: '+12%', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
        { label: 'Active Users', value: '18', change: '+3', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { label: 'Orders Today', value: '47', change: '+8%', icon: ShoppingCart, color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { label: 'Pending Orders', value: '8', change: '-2', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    ]

    const topProducts = [
        { name: 'Paracetamol 500mg', sales: 142, revenue: 'TK. 7,100/-', stock: 45 },
        { name: 'Amoxicillin 250mg', sales: 98, revenue: 'TK. 4,900/-', stock: 32 },
        { name: 'Vitamin C 1000mg', sales: 76, revenue: 'TK. 3,800/-', stock: 67 },
        { name: 'Omeprazole 20mg', sales: 54, revenue: 'TK. 5,400/-', stock: 28 },
    ]

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
                    <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Today
                    </Button>
                    <Button size="sm">
                        <Activity className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                        <div className="flex items-baseline gap-2 mt-2">
                                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                            <Badge variant="secondary" className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                                                {stat.change}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Stats & Alerts */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Sales Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Overview</CardTitle>
                            <CardDescription>Monthly sales performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Monthly Target</p>
                                        <p className="text-2xl font-bold">TK. 250,000/-</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Achieved</p>
                                        <p className="text-2xl font-bold text-green-600">TK. 187,500/-</p>
                                    </div>
                                </div>
                                <Progress value={stats.monthlyTarget} className="h-2" />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Target: TK. 250,000/-</span>
                                    <span>{stats.monthlyTarget}% Completed</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest system activities</CardDescription>
                            </div>
                            <Link href="/dashboard/sales">
                                <Button variant="ghost" size="sm" className="text-primary">
                                    View All <ArrowUpRight className="h-4 w-4 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-accent/50 rounded-lg transition-colors">
                                        <div className={`p-2 rounded-full ${activity.type === 'sale' ? 'bg-green-100 text-green-600' :
                                            activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                                                activity.type === 'alert' ? 'bg-red-100 text-red-600' :
                                                    'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {activity.type === 'sale' && <ShoppingCart className="h-4 w-4" />}
                                            {activity.type === 'user' && <Users className="h-4 w-4" />}
                                            {activity.type === 'alert' && <AlertCircle className="h-4 w-4" />}
                                            {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                                            {activity.type === 'inventory' && <Package className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{activity.action}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.user && `${activity.user} • `}
                                                {activity.amount && `${activity.amount} • `}
                                                {activity.product && `${activity.product} • `}
                                                {activity.quantity && `Only ${activity.quantity} left`}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Quick Info */}
                <div className="space-y-6">
                    {/* Top Products */}
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
                                            <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-foreground">{product.revenue}</p>
                                            <Badge
                                                variant={product.stock < 30 ? "destructive" : "outline"}
                                                className="text-xs"
                                            >
                                                Stock: {product.stock}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/dashboard/sales">
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Analytics
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

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
                                        <p className="text-sm text-muted-foreground">{stats.lowStockItems} items need attention</p>
                                    </div>
                                    <Badge variant="outline" className="text-yellow-600">Alert</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                    <div>
                                        <p className="font-medium text-foreground">Pending Orders</p>
                                        <p className="text-sm text-muted-foreground">{stats.pendingOrders} orders to process</p>
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
        </div>
    )
}