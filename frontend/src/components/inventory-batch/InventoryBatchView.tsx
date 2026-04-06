"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { InventoryBatchItem } from "@/types/inventoryBatch";

interface Props {
    batch: InventoryBatchItem;
}

export default function InventoryBatchView({ batch }: Props) {
    const router = useRouter();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case "expired":
                return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
            case "low_stock":
                return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Batch Details</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>

            <Card>
                <CardContent className="space-y-6 pt-6">

                    {/* Batch Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <p className="text-sm text-primary">Medicine Name</p>
                            <p className="font-medium capitalize">
                                {batch.medicineId?.name || "N/A"}
                            </p>
                        </div>

                        {/* <div>
                            <p className="text-sm text-primary">Generic Name</p>
                            <p className="capitalize">{batch.medicineId?.genericName || "N/A"}</p>
                        </div> */}

                        <div>
                            <p className="text-sm text-primary">Dosage</p>
                            <p className="capitalize">
                                {batch.medicineId?.dosageForm} {batch.medicineId?.strength}
                                {batch.medicineId?.unit}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-primary">Batch Number</p>
                            <p className="font-medium">{batch.batchNo}</p>
                        </div>

                        <div>
                            <p className="text-sm text-primary">Expiry Date</p>
                            <p>
                                {batch.expiryDate
                                    ? format(new Date(batch.expiryDate), "PPP")
                                    : "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-primary">Quantity</p>
                            <p>{batch.quantity}</p>
                        </div>

                        <div>
                            <p className="text-sm text-primary">Purchase Price</p>
                            <p>Tk. {batch.purchasePrice.toFixed(2)}/-</p>
                        </div>

                        <div>
                            <p className="text-sm text-primary">Status</p>
                            {getStatusBadge(batch.status)}
                        </div>
                    </div>

                    <Separator />

                    {/* Organization Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

                        <div>
                            <p className="text-primary">Organization</p>
                            <p className="capitalize">{batch.organizationId?.name || "N/A"}</p>
                        </div>

                        <div>
                            <p className="text-primary">Branch</p>
                            <p className="capitalize">{batch.branchId?.name || "N/A"}</p>
                        </div>

                        <div>
                            <p className="text-primary">Warehouse</p>
                            <p className="capitalize">{batch.warehouseId?.name || "N/A"}</p>
                        </div>

                    </div>

                    <Separator />

                    {/* Meta Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

                        <div>
                            <p className="text-primary">Created By</p>
                            <p className="capitalize">
                                {batch.createdBy?.name ||
                                    batch.createdBy?.email ||
                                    "System"}
                            </p>
                        </div>

                        <div>
                            <p className="text-primary">Created At</p>
                            <p>
                                {batch.createdAt
                                    ? format(new Date(batch.createdAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-primary">Last Updated</p>
                            <p>
                                {batch.updatedAt
                                    ? format(new Date(batch.updatedAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>

                    </div>

                </CardContent>
            </Card>
        </div>
    );
};