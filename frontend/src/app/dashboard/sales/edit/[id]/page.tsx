"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSaleStore } from "@/store/sale.store";
import { Button } from "@/components/ui/button";
import SalesForm from "@/components/sales/SalesForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditSalePage() {
    const { id } = useParams();
    const router = useRouter();
    const { fetchSaleById, loadSaleIntoForm, resetForm } = useSaleStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSale = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid sale ID");
                setLoading(false);
                return;
            }

            const sale = await fetchSaleById(id);
            if (sale) {
                loadSaleIntoForm(sale);
            } else {
                setError("Sale not found");
            }
            setLoading(false);
        };

        loadSale();

        // Cleanup: reset form when leaving the page
        return () => {
            resetForm();
        };
    }, [id, fetchSaleById, loadSaleIntoForm, resetForm]);

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
                <h1 className="text-2xl font-bold">Edit Sale</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <SalesForm saleId={id as string} onSuccess={() => router.push("/dashboard/sales/sales-list")} />
        </div>
    );
}