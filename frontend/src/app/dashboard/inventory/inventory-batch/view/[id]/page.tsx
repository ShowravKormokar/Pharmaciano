"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { Button } from "@/components/ui/button";
import InventoryBatchView from "@/components/inventory-batch/InventoryBatchView";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewInventoryBatchPage() {
    const { id } = useParams();
    const router = useRouter();
    const { batches, fetchBatches, fetchBatchById } = useInventoryBatchStore();
    const [batch, setBatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBatch = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid batch ID");
                setLoading(false);
                return;
            }

            // Try from store first
            let found = batches.find((b) => b._id === id);
            if (found) {
                setBatch(found);
                setLoading(false);
                return;
            }

            // If not, fetch by ID
            const result = await fetchBatchById(id as string);
            if (result) {
                setBatch(result);
            } else {
                setError("Batch not found");
            }
            setLoading(false);
        };

        loadBatch();
    }, [id, batches, fetchBatchById]);

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error || !batch) {
        return (
            <div className="p-6">
                <p className="text-red-500">{error || "Batch not found"}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <InventoryBatchView batch={batch} />
        </div>
    );
}