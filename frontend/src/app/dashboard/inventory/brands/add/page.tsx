"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BrandForm from "@/components/brand/BrandForm";
import { useBrandStore } from "@/store/brand.store";

export default function AddBrandPage() {
    const router = useRouter();
    const resetForm = useBrandStore((state) => state.resetForm);

    useEffect(() => {
        resetForm();
    }, [resetForm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New Brand</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <BrandForm onSuccess={() => router.push("/dashboard/inventory/brands/brand-list")} />
        </div>
    );
}