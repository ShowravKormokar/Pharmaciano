import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'

export default function POSPage() {
    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Point of Sale</h1>
                    <p className="text-muted-foreground mt-1">
                        Quick and easy sales transactions
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products List */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Products</CardTitle>
                            <CardDescription>Select products to add to cart</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                                    <Card
                                        key={item}
                                        className="cursor-pointer hover:border-primary transition-colors"
                                    >
                                        <CardContent className="p-4 text-center">
                                            <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-2 flex items-center justify-center">
                                                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <p className="font-medium">Product {item}</p>
                                            <p className="text-sm text-muted-foreground">TK. 500/-</p>
                                            <Button size="sm" className="w-full mt-2">
                                                Add to Cart
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cart */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Cart</CardTitle>
                            <CardDescription>Current order items</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Cart Items */}
                                <div className="space-y-3">
                                    <div className="flex  items-end justify-between p-2 border rounded-lg">
                                        <div>
                                            <p className="font-medium mb-1">Product 1</p>
                                            <p className="text-sm text-muted-foreground">TK. 500/- <br /> × 2</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="icon" variant="outline">
                                                <Minus className="h-2 w-2" />
                                            </Button>
                                            <span className="w-4 text-center">2</span>
                                            <Button size="icon" variant="outline">
                                                <Plus className="h-2 w-2" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Cart Summary */}
                                <div className="space-y-2 border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>TK. 1,000/-</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax (15%)</span>
                                        <span>TK. 150/-</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                        <span>Total</span>
                                        <span>TK. 1,150/-</span>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="space-y-3">
                                    <Label htmlFor="customer">Customer Name</Label>
                                    <Input id="customer" placeholder="Walk-in customer" />

                                    <Label htmlFor="payment">Payment Method</Label>
                                    <select
                                        title='payment'
                                        id="payment"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="card">Card</option>
                                        <option value="mobile">Mobile Banking</option>
                                    </select>
                                </div>

                                <Button className="w-full" size="lg">
                                    Process Payment
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}