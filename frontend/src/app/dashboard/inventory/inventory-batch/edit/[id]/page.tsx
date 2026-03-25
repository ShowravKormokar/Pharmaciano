"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { Button } from "@/components/ui/button";
import InventoryBatchForm from "@/components/inventory-batch/InventoryBatchForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditInventoryBatchPage() {
    const { id } = useParams();
    const router = useRouter();
    const { batches, fetchBatches, setForm } = useInventoryBatchStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBatch = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid batch ID");
                setLoading(false);
                return;
            }

            let batch = batches.find((b) => b._id === id);
            if (!batch && batches.length === 0) {
                await fetchBatches();
                batch = batches.find((b) => b._id === id);
            }

            if (!batch) {
                setError("Batch not found");
                setLoading(false);
                return;
            }

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
            setLoading(false);
        };

        loadBatch();
    }, [id, batches, fetchBatches, setForm]);

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-500">{error}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Edit Inventory Batch</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <InventoryBatchForm batchId={id as string} onSuccess={() => router.push("/dashboard/inventory/inventory-batch/list")} />
        </div>
    );
}