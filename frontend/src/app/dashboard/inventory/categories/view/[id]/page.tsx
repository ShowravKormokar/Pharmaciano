"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCategoryStore } from "@/store/category.store";
import { Button } from "@/components/ui/button";
import CategoryView from "@/components/category/CategoryView";
import { RefreshCcw } from "lucide-react";

export default function ViewCategoryPage() {
    const { id } = useParams();
    const router = useRouter();
    const { fetchCategoryById } = useCategoryStore();
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCategory = useCallback(async () => {
        if (!id || Array.isArray(id)) {
            setError("Invalid category ID");
            setLoading(false);
            return;
        }
        setLoading(true);
        const result = await fetchCategoryById(id as string);
        if (result) {
            setCategory(result);
            setError(null);
        } else {
            setError("Category not found");
        }
        setLoading(false);
    }, [id, fetchCategoryById]);

    useEffect(() => {
        loadCategory();
    }, [loadCategory]);

    const handleRefresh = () => {
        loadCategory();
    };

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
                <h1 className="text-2xl font-bold">Category Details</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={() => router.back()}>
                        Back
                    </Button>
                </div>
            </div>
            <CategoryView category={category} loading={loading} />
        </div>
    );
}