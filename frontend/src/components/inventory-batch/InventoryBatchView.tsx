"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'expired':
                return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
            case 'low_stock':
                return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Batch Details</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>

            <Card>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Medicine</p>
                            <p className="font-medium capitalize">
                                {typeof batch.medicineId === 'object' ? batch.medicineId?.name : batch.medicineName}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Batch Number</p>
                            <p className="font-medium">{batch.batchNo}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Expiry Date</p>
                            <p>{batch.expiryDate ? format(new Date(batch.expiryDate), "PPP") : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Quantity</p>
                            <p>{batch.quantity}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Purchase Price</p>
                            <p>${batch.purchasePrice.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            {getStatusBadge(batch.status)}
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Organization</p>
                            <p className="capitalize">{batch.orgName || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Branch</p>
                            <p className="capitalize">{batch.branchName || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Warehouse</p>
                            <p className="capitalize">{batch.warehouseName || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p className="capitalize">{batch.createdBy?.name || batch.createdBy?.email || "System"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>{batch.createdAt ? format(new Date(batch.createdAt), "PPP p") : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>{batch.updatedAt ? format(new Date(batch.updatedAt), "PPP p") : "N/A"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}