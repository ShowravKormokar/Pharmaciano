"use client";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { InventoryBatchItem } from "@/types/inventoryBatch";

interface Props {
    batch: InventoryBatchItem;
}

export default function InventoryBatchActions({ batch }: Props) {
    const router = useRouter();
    const deleteBatch = useInventoryBatchStore((state) => state.deleteBatch);
    const setForm = useInventoryBatchStore((state) => state.setForm);

    const handleEdit = () => {
        setForm({
            medicineName: typeof batch.medicineId === 'object' ? batch.medicineId?.name || "" : batch.medicineName || "",
            batchNo: batch.batchNo,
            expiryDate: batch.expiryDate ? new Date(batch.expiryDate).toISOString().split('T')[0] : "",
            quantity: batch.quantity,
            purchasePrice: batch.purchasePrice,
            orgName: batch.orgName || "",
            branchName: batch.branchName || "",
            warehouseName: batch.warehouseName || "",
            status: batch.status,
            isActive: batch.status === 'active',
        });
        router.push(`/dashboard/inventory/inventory-batch/edit/${batch._id}`);
    };

    const handleDelete = async (id: string) => {
        await deleteBatch(id);
    };

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/inventory/inventory-batch/view/${batch._id}`)}
                title="View"
                className="border-[0.1rem] rounded-md"
            >
                <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit} title="Edit">
                <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" title="Delete">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Inventory Batch?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the batch.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(batch._id)}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}