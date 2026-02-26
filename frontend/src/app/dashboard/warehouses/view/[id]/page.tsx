"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWarehouseStore } from "@/store/warehouse.store";
import { Button } from "@/components/ui/button";
import WarehouseView from "@/components/warehouse/WarehouseView";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewWarehousePage() {
    const { id } = useParams();
    const router = useRouter();
    const { warehouses, fetchWarehouses, fetchWarehouseById, loading } = useWarehouseStore();
    const [warehouse, setWarehouse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWarehouse = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid warehouse ID");
                return;
            }

            // First try from existing list
            let found = warehouses.find((w) => w._id === id);
            if (found) {
                setWarehouse(found);
                return;
            }

            // If not, fetch by ID
            const result = await fetchWarehouseById(id);
            if (result) {
                setWarehouse(result);
            } else {
                setError("Warehouse not found");
            }
        };

        loadWarehouse();
    }, [id, warehouses, fetchWarehouseById]);

    if (loading || !warehouse) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-32 w-full" />
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
        <div className="p-6">
            <WarehouseView warehouse={warehouse} />
        </div>
    );
}