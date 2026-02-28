"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "@/store/category.store";
import CategoryForm from "@/components/category/CategoryForm";

export default function AddCategoryPage() {
    const router = useRouter();
    const resetForm = useCategoryStore((state) => state.resetForm);

    useEffect(() => {
        resetForm();
    }, [resetForm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New Category</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <CategoryForm onSuccess={() => router.push("/dashboard/inventory/categories/category-list")} />
        </div>
    );
}