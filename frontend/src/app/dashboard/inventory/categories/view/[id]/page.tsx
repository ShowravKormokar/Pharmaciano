"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCategoryStore } from "@/store/category.store";
import { Button } from "@/components/ui/button";
import CategoryView from "@/components/category/CategoryView";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewCategoryPage() {
    const { id } = useParams();
    const router = useRouter();
    const { categories, fetchCategories, fetchCategoryById } = useCategoryStore();
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategory = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid category ID");
                setLoading(false);
                return;
            }

            // Try from store first
            let found = categories.find((c) => c._id === id);
            if (found) {
                setCategory(found);
                setLoading(false);
                return;
            }

            // If not, fetch by ID
            const result = await fetchCategoryById(id as string);
            if (result) {
                setCategory(result);
            } else {
                setError("Category not found");
            }
            setLoading(false);
        };

        loadCategory();
    }, [id, categories, fetchCategoryById]);

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="p-6">
                <p className="text-red-500">{error || "Category not found"}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <CategoryView category={category} />
        </div>
    );
}