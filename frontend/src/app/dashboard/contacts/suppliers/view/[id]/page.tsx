"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSupplierStore } from "@/store/supplier.store";
import { Button } from "@/components/ui/button";
import SupplierView from "@/components/supplier/SupplierView";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewSupplierPage() {
    const { id } = useParams();
    const router = useRouter();
    const { suppliers, fetchSuppliers, fetchSupplierById } = useSupplierStore();
    const [supplier, setSupplier] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSupplier = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid supplier ID");
                setLoading(false);
                return;
            }

            // Try from store first
            let found = suppliers.find((s) => s._id === id);
            if (found) {
                setSupplier(found);
                setLoading(false);
                return;
            }

            // If not, fetch by ID
            const result = await fetchSupplierById(id as string);
            if (result) {
                setSupplier(result);
            } else {
                setError("Supplier not found");
            }
            setLoading(false);
        };

        loadSupplier();
    }, [id, suppliers, fetchSupplierById]);

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error || !supplier) {
        return (
            <div className="p-6">
                <p className="text-red-500">{error || "Supplier not found"}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <SupplierView supplier={supplier} />
        </div>
    );
}