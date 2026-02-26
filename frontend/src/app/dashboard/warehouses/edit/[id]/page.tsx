"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWarehouseStore } from "@/store/warehouse.store";
import { Button } from "@/components/ui/button";
import WarehouseForm from "@/components/warehouse/WarehouseForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditWarehousePage() {
    const { id } = useParams();
    const router = useRouter();
    const { warehouses, fetchWarehouses, setForm } = useWarehouseStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWarehouse = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid warehouse ID");
                setLoading(false);
                return;
            }

            let warehouse = warehouses.find((w) => w._id === id);
            if (!warehouse && warehouses.length === 0) {
                await fetchWarehouses();
                warehouse = warehouses.find((w) => w._id === id);
            }

            if (!warehouse) {
                setError("Warehouse not found");
                setLoading(false);
                return;
            }

            setForm({
                name: warehouse.name,
                location: warehouse.location,
                capacity: warehouse.capacity,
                branchName: warehouse.branchName || warehouse.branchId?.name || "",
                isActive: warehouse.isActive,
            });
            setLoading(false);
        };

        loadWarehouse();
    }, [id, warehouses, fetchWarehouses, setForm]);

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
                <h1 className="text-2xl font-bold">Edit Warehouse</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <WarehouseForm warehouseId={id as string} onSuccess={() => router.push("/dashboard/warehouse/list")} />
        </div>
    );
}