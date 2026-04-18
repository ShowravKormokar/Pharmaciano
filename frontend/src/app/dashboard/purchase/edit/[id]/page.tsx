"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePurchaseStore } from "@/store/purchase.store";
import { Button } from "@/components/ui/button";
import PurchaseForm from "@/components/purchase/PurchaseForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPurchasePage() {
    const { id } = useParams();
    const router = useRouter();

    const {
        fetchPurchaseById,
        setForm,
        resetForm,
    } = usePurchaseStore();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            // Validate ID
            if (!id || Array.isArray(id)) {
                setError("Invalid ID");
                setLoading(false);
                return;
            }

            const data = await fetchPurchaseById(id);

            if (data) {
                setForm({
                    supplier: data.supplierId.name,
                    warehouseName: data.warehouseId.name,
                    items: data.items.map((item) => ({
                        medicineName: item.medicineName,
                        quantity: item.quantity,
                    })),
                    paymentStatus: data.paymentStatus,
                    paidAmount: data.paidAmount,
                    discount: data.discount,
                    tax: data.tax,
                    organizationName: data.organizationId.name,
                    branchName: data.branchId.name,
                });
            } else {
                setError("Purchase not found");
            }

            setLoading(false);
        };

        load();

        return () => {
            resetForm();
        };
    }, [id, fetchPurchaseById, setForm, resetForm]);

    // Loading State
    if (loading) {
        return (
            <div className="p-6">
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="p-6 space-y-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    // Main UI
    return (
        <div className="p-6 space-y-6">

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Edit Purchase
                </h1>

                <Button
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Back
                </Button>
            </div>

            <PurchaseForm
                purchaseId={id as string}
                onSuccess={() =>
                    router.push("/dashboard/purchase/purchase-list")
                }
            />

        </div>
    );
};