"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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

    // ✅ Safe number formatter
    const safeNumber = (val: any) => Number(val || 0).toFixed(2);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800"
                    >
                        Pending
                    </Badge>
                );

            case "approved":
                return (
                    <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800"
                    >
                        Approved
                    </Badge>
                );

            case "received":
                return (
                    <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                    >
                        Received
                    </Badge>
                );

            default:
                return <Badge>{status}</Badge>;
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
                <CardContent className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Purchase No.
                            </p>
                            <p className="font-medium">
                                {purchase?.purchaseNo || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Status
                            </p>
                            {getStatusBadge(purchase?.status)}
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Supplier
                            </p>
                            <p className="capitalize">
                                {purchase?.supplierId?.name || "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                                {purchase?.supplierId?.contactPerson || "N/A"} |{" "}
                                {purchase?.supplierId?.phone || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Warehouse
                            </p>
                            <p className="capitalize">
                                {purchase?.warehouseId?.name || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Organization
                            </p>
                            <p className="capitalize">
                                {purchase?.organizationId?.name || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Branch
                            </p>
                            <p className="capitalize">
                                {purchase?.branchId?.name || "N/A"}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Items */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Items
                        </p>

                        <div className="space-y-2">
                            {purchase?.items?.length ? (
                                purchase.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center p-2 border rounded"
                                    >
                                        <div>
                                            <p className="font-medium capitalize">
                                                {item.medicineName || "N/A"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Qty: {item.quantity || 0} | Price:{" "}
                                                {safeNumber(item.purchasePrice)}
                                            </p>
                                        </div>

                                        {/* ✅ Safe totalCost OR calculated fallback */}
                                        <p>
                                            TK.{" "}
                                            {safeNumber(
                                                item.totalCost ??
                                                item.quantity *
                                                item.purchasePrice
                                            )}
                                            /-
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No items found
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Calculation */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>
                                TK. {safeNumber(purchase?.subtotal)}/-
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Discount ({purchase?.discount || 0}%):</span>
                            <span>
                                - TK.{" "}
                                {safeNumber(
                                    (purchase?.subtotal || 0) *
                                    (purchase?.discount || 0) /
                                    100
                                )}
                                /-
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Tax ({purchase?.tax || 0}%):</span>
                            <span>
                                + TK.{" "}
                                {safeNumber(
                                    ((purchase?.subtotal || 0) -
                                        ((purchase?.subtotal || 0) *
                                            (purchase?.discount || 0)) /
                                        100) *
                                    (purchase?.tax || 0) /
                                    100
                                )}
                                /-
                            </span>
                        </div>

                        <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>
                                TK. {safeNumber(purchase?.totalAmount)}/-
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Paid:</span>
                            <span>
                                TK. {safeNumber(purchase?.paidAmount)}/-
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Due:</span>
                            <span>
                                TK. {safeNumber(purchase?.dueAmount)}/-
                            </span>
                        </div>
                    </div>

                    <Separator />

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">
                                Approved By
                            </p>
                            <p className="capitalize">
                                {purchase?.approvedBy?.name || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">
                                Created At
                            </p>
                            <p>
                                {purchase?.createdAt
                                    ? format(
                                        new Date(purchase.createdAt),
                                        "PPP p"
                                    )
                                    : "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">
                                Last Updated
                            </p>
                            <p>
                                {purchase?.updatedAt
                                    ? format(
                                        new Date(purchase.updatedAt),
                                        "PPP p"
                                    )
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}