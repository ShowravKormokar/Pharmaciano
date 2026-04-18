"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { PurchaseItem } from "@/types/purchase";

interface Props {
    purchase: PurchaseItem;
}

export default function PurchaseView({ purchase }: Props) {
    const router = useRouter();
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;

            case 'approved': return <Badge variant="outline" className="bg-blue-100 text-blue-800">Approved</Badge>;

            case 'received': return <Badge variant="outline" className="bg-green-100 text-green-800">Received</Badge>;
            
            default: return <Badge>{status}</Badge>;
        }
    };
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Purchase Details</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Purchase Information</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <p className="text-sm text-muted-foreground">Purchase No.</p>
                            <p className="font-medium">{purchase.purchaseNo}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            {getStatusBadge(purchase.status)}
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Supplier</p>
                            <p>{purchase.supplierId.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {purchase.supplierId.contactPerson} | {purchase.supplierId.phone}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Warehouse</p>
                            <p>{purchase.warehouseId.name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Organization</p>
                            <p>{purchase.organizationId.name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Branch</p>
                            <p>{purchase.branchId.name}</p>
                        </div>

                    </div>

                    <Separator />

                    {/* Items */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Items</p>

                        <div className="space-y-2">
                            {purchase.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center p-2 border rounded"
                                >
                                    <div>
                                        <p className="font-medium">{item.medicineName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Qty: {item.quantity} | Price: {item.purchasePrice}
                                        </p>
                                    </div>

                                    <p>TK. {item.totalCost.toFixed(2)}/-</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Calculation */}
                    <div className="space-y-2">

                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>TK. {purchase.subtotal.toFixed(2)}/-</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Discount ({purchase.discount}%):</span>
                            <span>
                                - TK. {((purchase.subtotal * purchase.discount) / 100).toFixed(2)}/-
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Tax ({purchase.tax}%):</span>
                            <span>
                                + TK. {(
                                    ((purchase.subtotal - (purchase.subtotal * purchase.discount) / 100) *
                                        purchase.tax) /
                                    100
                                ).toFixed(2)}/-
                            </span>
                        </div>

                        <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>TK. {purchase.totalAmount.toFixed(2)}/-</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Paid:</span>
                            <span>TK. {purchase.paidAmount.toFixed(2)}/-</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Due:</span>
                            <span>TK. {purchase.dueAmount.toFixed(2)}/-</span>
                        </div>

                    </div>

                    <Separator />

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">

                        <div>
                            <p className="text-muted-foreground">Approved By</p>
                            <p>{purchase.approvedBy?.name || "N/A"}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>{format(new Date(purchase.createdAt), "PPP p")}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>{format(new Date(purchase.updatedAt), "PPP p")}</p>
                        </div>

                    </div>

                </CardContent>
            </Card>
        </div>
    );
}