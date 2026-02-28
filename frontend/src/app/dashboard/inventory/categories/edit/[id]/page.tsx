"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCategoryStore } from "@/store/category.store";
import { Button } from "@/components/ui/button";
import CategoryForm from "@/components/category/CategoryForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCategoryPage() {
    const { id } = useParams();
    const router = useRouter();
    const { categories, fetchCategories, setForm } = useCategoryStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategory = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid category ID");
                setLoading(false);
                return;
            }

            let category = categories.find((c) => c._id === id);
            if (!category && categories.length === 0) {
                await fetchCategories();
                category = categories.find((c) => c._id === id);
            }

            if (!category) {
                setError("Category not found");
                setLoading(false);
                return;
            }

            setForm({
                name: category.name,
                description: category.description || "",
                isActive: category.isActive,
            });
            setLoading(false);
        };

        loadCategory();
    }, [id, categories, fetchCategories, setForm]);

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
                <h1 className="text-2xl font-bold">Edit Category</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <CategoryForm categoryId={id as string} onSuccess={() => router.push("/dashboard/inventory/categories/category-list")} />
        </div>
    );
}