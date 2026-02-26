"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import WarehouseForm from "@/components/warehouse/WarehouseForm";
import { useWarehouseStore } from "@/store/warehouse.store";

export default function AddWarehousePage() {
    const router = useRouter();
    const resetForm = useWarehouseStore((state) => state.resetForm);

    useEffect(() => {
        resetForm();
    }, [resetForm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New Warehouse</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <WarehouseForm onSuccess={() => router.push("/dashboard/warehouse/list")} />
        </div>
    );
}