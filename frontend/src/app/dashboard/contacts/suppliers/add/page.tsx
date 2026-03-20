"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SupplierForm from "@/components/supplier/SupplierForm";
import { useSupplierStore } from "@/store/supplier.store";

export default function AddSupplierPage() {
    const router = useRouter();
    const resetForm = useSupplierStore((state) => state.resetForm);

    useEffect(() => {
        resetForm();
    }, [resetForm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New Supplier</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <SupplierForm onSuccess={() => router.push("/dashboard/contacts/suppliers/list")} />
        </div>
    );
}