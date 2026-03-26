"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { SaleItem } from "@/types/sale";

interface Props {
    sale: SaleItem;
}

export default function SalesView({ sale }: Props) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Sale Details</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Invoice {sale.invoiceNo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Customer</p>
                            <p className="capitalize">{sale.customerName || "Walk-in"}</p>
                            {sale.customerPhone && <p className="text-sm">{sale.customerPhone}</p>}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Date & Time</p>
                            <p>{format(new Date(sale.createdAt), "PPP p")}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Cashier</p>
                            <p className="capitalize">{sale.cashierId?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Payment Method</p>
                            <Badge variant="outline" className="capitalize">
                                {sale.paymentMethod}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Items</p>
                        <div className="space-y-2">
                            {sale.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center p-2 border rounded"
                                >
                                    <div>
                                        <p className="font-medium capitalize">{item.medicineName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Batch: {item.batchNo} | Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <p>Tk {(item.sellingPrice * item.quantity).toFixed(2)}/-</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>Tk {sale.subtotal.toFixed(2)}/-</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Discount ({sale.discount}%):</span>
                            <span>-Tk {((sale.subtotal * sale.discount) / 100).toFixed(2)}/-</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Tax ({sale.tax}%):</span>
                            <span>+Tk {(((sale.subtotal - (sale.subtotal * sale.discount) / 100) * sale.tax) / 100).toFixed(2)}/-</span>
                        </div>
                        <div className="flex justify-between font-bold pt-2 border-t">
                            <span>Total:</span>
                            <span>Tk {sale.totalAmount.toFixed(2)}/-</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};