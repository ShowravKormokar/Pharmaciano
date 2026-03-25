"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import InventoryBatchForm from "@/components/inventory-batch/InventoryBatchForm";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";

export default function AddInventoryBatchPage() {
    const router = useRouter();
    const resetForm = useInventoryBatchStore((state) => state.resetForm);

    useEffect(() => {
        resetForm();
    }, [resetForm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New Inventory Batch</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <InventoryBatchForm onSuccess={() => router.push("/dashboard/inventory/inventory-batch/list")} />
        </div>
    );
}