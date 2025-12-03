import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Download, Filter, MoreVertical, Search } from 'lucide-react'
import Link from 'next/link'

export default function SalesListPage() {
    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Sales List</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage all sales transactions
                    </p>
                </div>
                <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search by invoice ID, customer name..." className="pl-9" />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-2">
                            <Input type="date" className="w-full lg:w-40" />
                            <Input type="date" className="w-full lg:w-40" />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filter
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>All Status</DropdownMenuItem>
                                    <DropdownMenuItem>Completed</DropdownMenuItem>
                                    <DropdownMenuItem>Pending</DropdownMenuItem>
                                    <DropdownMenuItem>Cancelled</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sales Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>List of all sales transactions</CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Total: <span className="font-semibold text-foreground">5</span> sales
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                { id: '#001', customer: 'Walk-in Customer', date: '2024-01-15', amount: 1250, status: 'Completed', payment: 'Cash' },
                                { id: '#002', customer: 'Regular Customer', date: '2024-01-15', amount: 2800, status: 'Completed', payment: 'Card' },
                                { id: '#003', customer: 'Hospital Order', date: '2024-01-14', amount: 8400, status: 'Pending', payment: 'Bank Transfer' },
                                { id: '#004', customer: 'Pharmacy Store', date: '2024-01-14', amount: 5200, status: 'Completed', payment: 'Cash' },
                                { id: '#005', customer: 'Online Order', date: '2024-01-13', amount: 3100, status: 'Completed', payment: 'Mobile Banking' },
                            ].map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell className="font-medium">{sale.id}</TableCell>
                                    <TableCell>{sale.customer}</TableCell>
                                    <TableCell>{sale.date}</TableCell>
                                    <TableCell>TK. {sale.amount.toLocaleString()}/-</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sale.status === 'Completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {sale.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{sale.payment}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/sales/sales-list/${sale.id.slice(1)}`}>
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">Cancel Sale</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}