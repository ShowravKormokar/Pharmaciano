"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMedicineStore } from "@/store/medicine.store";
import { Button } from "@/components/ui/button";
import MedicineView from "@/components/medicine/MedicineView";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewMedicinePage() {
    const { id } = useParams();
    const router = useRouter();
    const { medicines, fetchMedicines, fetchMedicineById } = useMedicineStore();
    const [medicine, setMedicine] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMedicine = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid medicine ID");
                setLoading(false);
                return;
            }

            // Try from store first
            let found = medicines.find((m) => m._id === id);
            if (found) {
                setMedicine(found);
                setLoading(false);
                return;
            }

            // If not, fetch by ID
            const result = await fetchMedicineById(id as string);
            if (result) {
                setMedicine(result);
            } else {
                setError("Medicine not found");
            }
            setLoading(false);
        };

        loadMedicine();
    }, [id, medicines, fetchMedicineById]);

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error || !medicine) {
        return (
            <div className="p-6">
                <p className="text-red-500">{error || "Medicine not found"}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <MedicineView medicine={medicine} />
        </div>
    );
}