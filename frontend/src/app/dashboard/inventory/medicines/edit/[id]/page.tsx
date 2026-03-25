"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMedicineStore } from "@/store/medicine.store";
import { Button } from "@/components/ui/button";
import MedicineForm from "@/components/medicine/MedicineForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditMedicinePage() {
    const { id } = useParams();
    const router = useRouter();
    const { medicines, fetchMedicines, setForm } = useMedicineStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMedicine = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid medicine ID");
                setLoading(false);
                return;
            }

            let medicine = medicines.find((m) => m._id === id);
            if (!medicine && medicines.length === 0) {
                await fetchMedicines();
                medicine = medicines.find((m) => m._id === id);
            }

            if (!medicine) {
                setError("Medicine not found");
                setLoading(false);
                return;
            }

            setForm({
                name: medicine.name,
                genericName: medicine.genericName || "",
                categoryName: medicine.categoryName || "",
                brandName: medicine.brandName || "",
                dosageForm: medicine.dosageForm || "",
                strength: medicine.strength || "",
                unit: medicine.unit || "",
                unitPrice: medicine.unitPrice || 0,
                unitsPerStrip: medicine.unitsPerStrip || 0,
                isPrescriptionRequired: medicine.isPrescriptionRequired || false,
                taxRate: medicine.taxRate || 0,
                isActive: medicine.isActive,
            });
            setLoading(false);
        };

        loadMedicine();
    }, [id, medicines, fetchMedicines, setForm]);

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
                <h1 className="text-2xl font-bold">Edit Medicine</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <MedicineForm medicineId={id as string} onSuccess={() => router.push("/dashboard/inventory/medicines/list")} />
        </div>
    );
}