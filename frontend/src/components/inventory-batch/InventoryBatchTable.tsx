"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InventoryBatchItem } from "@/types/inventoryBatch";
import { format } from "date-fns";
import InventoryBatchActions from "./InventoryBatchActions";

interface Props {
    batches: InventoryBatchItem[];
}

export default function InventoryBatchTable({ batches }: Props) {
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
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Medicine</TableHead>
                        <TableHead>Batch No.</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Purchase Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {batches.map((batch) => (
                        <TableRow key={batch._id}>
                            <TableCell className="font-medium capitalize">
                                {typeof batch.medicineId === 'object' ? batch.medicineId?.name : batch.medicineName}
                            </TableCell>
                            <TableCell>{batch.batchNo}</TableCell>
                            <TableCell>
                                {batch.expiryDate ? format(new Date(batch.expiryDate), "MMM dd, yyyy") : "—"}
                            </TableCell>
                            <TableCell>{batch.quantity}</TableCell>
                            <TableCell>Tk {batch.purchasePrice.toFixed(2)}/-</TableCell>
                            <TableCell>{getStatusBadge(batch.status)}</TableCell>
                            <TableCell className="text-right">
                                <InventoryBatchActions batch={batch} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {batches.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                                No inventory batches found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}