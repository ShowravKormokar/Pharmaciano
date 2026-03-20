"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSupplierStore } from "@/store/supplier.store";
import { Button } from "@/components/ui/button";
import SupplierForm from "@/components/supplier/SupplierForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditSupplierPage() {
    const { id } = useParams();
    const router = useRouter();
    const { suppliers, fetchSuppliers, setForm } = useSupplierStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSupplier = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid supplier ID");
                setLoading(false);
                return;
            }

            let supplier = suppliers.find((s) => s._id === id);
            if (!supplier && suppliers.length === 0) {
                await fetchSuppliers();
                supplier = suppliers.find((s) => s._id === id);
            }

            if (!supplier) {
                setError("Supplier not found");
                setLoading(false);
                return;
            }

            setForm({
                name: supplier.name,
                contactPerson: supplier.contactPerson || "",
                phone: supplier.phone || "",
                email: supplier.email || "",
                address: supplier.address || "",
                isActive: supplier.isActive,
            });
            setLoading(false);
        };

        loadSupplier();
    }, [id, suppliers, fetchSuppliers, setForm]);

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
                <h1 className="text-2xl font-bold">Edit Supplier</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <SupplierForm supplierId={id as string} onSuccess={() => router.push("/dashboard/contacts/suppliers/list")} />
        </div>
    );
}