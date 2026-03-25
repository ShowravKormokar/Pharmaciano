"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import MedicineForm from "@/components/medicine/MedicineForm";
import { useMedicineStore } from "@/store/medicine.store";

export default function AddMedicinePage() {
    const router = useRouter();
    const resetForm = useMedicineStore((state) => state.resetForm);

    useEffect(() => {
        resetForm();
    }, [resetForm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New Medicine</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <MedicineForm onSuccess={() => router.push("/dashboard/inventory/medicines/list")} />
        </div>
    );
}