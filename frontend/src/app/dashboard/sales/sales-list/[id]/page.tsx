import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Printer } from 'lucide-react'
import Link from 'next/link'

interface Props {
    params: {
        id: string
    }
}

export default function SaleDetailPage({ params }: Props) {
    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-0">
                <div className="flex items-start gap-4 w-full lg:w-auto">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard/sales/sales-list">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Sale Details</h1>
                        <p className="text-muted-foreground mt-1">
                            Invoice #{params.id}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>
                    <Button>
                        <Printer className="h-4 w-4 mr-2" />
                        Print Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Invoice Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">Walk-in Customer</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">+880 1XXX XXXXXX</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">customer@example.com</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Date</p>
                                    <p className="font-medium">2024-01-15 10:30 AM</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                            <CardDescription>Products included in this sale</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead>Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        { product: 'Paracetamol 500mg', quantity: 2, price: 50, total: 100 },
                                        { product: 'Amoxicillin 250mg', quantity: 1, price: 80, total: 80 },
                                        { product: 'Vitamin C 1000mg', quantity: 3, price: 30, total: 90 },
                                    ].map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.product}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>TK. {item.price}/-</TableCell>
                                            <TableCell>TK. {item.total}/-</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>TK. 270/-</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Discount</span>
                                    <span className="text-green-600">- TK. 20/-</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax (15%)</span>
                                    <span>TK. 37.50/-</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg border-t pt-3">
                                    <span>Total</span>
                                    <span>TK. 287.50/-</span>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment Method</span>
                                    <Badge variant="outline">Cash</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                                        Completed
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount Paid</span>
                                <span className="font-medium">TK. 300/-</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Change Given</span>
                                <span className="font-medium">TK. 12.50/-</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Cashier</span>
                                <span>John Doe</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}