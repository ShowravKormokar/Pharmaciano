import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@radix-ui/react-separator'
import { PlusCircle, Trash2 } from 'lucide-react'

export default function AddSalePage() {
    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Add New Sale</h1>
                    <p className="text-muted-foreground mt-1">
                        Manual sale entry with details
                    </p>
                </div>
                <Button variant="outline">Cancel</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                            <CardDescription>Enter customer details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerName">Customer Name *</Label>
                                <Input id="customerName" placeholder="Enter customer name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" placeholder="Enter phone number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" placeholder="Enter email address" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" placeholder="Enter customer address" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products List */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Products</CardTitle>
                                <Button variant="outline" size="sm">
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Product
                                </Button>
                            </div>
                            <CardDescription>Add products to this sale</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Product Row */}
                                <div className="flex items-center gap-4 p-3 border rounded-lg">
                                    <div>
                                        <div className="flex-1 mb-2">
                                            <Label className="text-xs mb-1">Product Name</Label>
                                            <Input placeholder="Enter product name" />
                                        </div>
                                        <div className="flex-1">
                                            <Label className="text-xs mb-1">Price</Label>
                                            <Input type="number" placeholder="Price" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="w-32 mb-2">
                                            <Label className="text-xs mb-1">Quantity</Label>
                                            <Input type="number" placeholder="Qty" defaultValue="1" />
                                        </div>
                                        <div className="w-32">
                                            <Label className="text-xs mb-1">Total</Label>
                                            <Input value="0" readOnly />
                                        </div>
                                    </div>
                                    <Separator orientation="vertical" className='w-2 bg-red-100' />
                                    <Button variant="ghost" size="icon" className="text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="border border-dashed rounded-lg p-4 text-center">
                                    <p className="text-muted-foreground">Add more products to this sale</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Payment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                            <CardDescription>Select payment method and details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="paymentMethod">Payment Method *</Label>
                                <select
                                    title='paymentMethod'
                                    id="paymentMethod"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="">Select method</option>
                                    <option value="cash">Cash</option>
                                    <option value="card">Credit/Debit Card</option>
                                    <option value="mobile">Mobile Banking</option>
                                    <option value="bank">Bank Transfer</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amountPaid">Amount Paid *</Label>
                                <Input id="amountPaid" type="number" placeholder="Enter amount paid" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discount">Discount</Label>
                                <Input id="discount" type="number" placeholder="Enter discount amount" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Additional Notes</Label>
                                <Textarea id="notes" placeholder="Any additional notes..." />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>TK. 0/-</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Discount</span>
                                    <span className="text-green-600">- TK. 0/-</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax (15%)</span>
                                    <span>TK. 0/-</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg border-t pt-3">
                                    <span>Total Amount</span>
                                    <span>TK. 0/-</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Amount Paid</span>
                                    <span>TK. 0/-</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Balance Due</span>
                                    <span>TK. 0/-</span>
                                </div>
                            </div>
                            <Button className="w-full mt-6" size="lg">
                                Save Sale
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}