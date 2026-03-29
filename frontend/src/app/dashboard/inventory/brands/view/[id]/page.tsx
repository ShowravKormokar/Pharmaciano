"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBrandStore } from "@/store/brand.store";
import { Button } from "@/components/ui/button";
import BrandView from "@/components/brand/BrandView";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewBrandPage() {
    const { id } = useParams();
    const router = useRouter();
    const { fetchBrandById } = useBrandStore();
    const [brand, setBrand] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadBrand = useCallback(async () => {
        if (!id || Array.isArray(id)) {
            setError("Invalid brand ID");
            setLoading(false);
            return;
        }
        setLoading(true);
        const result = await fetchBrandById(id as string);
        if (result) {
            setBrand(result);
            setError(null);
        } else {
            setError("Brand not found");
        }
        setLoading(false);
    }, [id, fetchBrandById]);

    useEffect(() => {
        loadBrand();
    }, [loadBrand]);

    const handleRefresh = () => {
        loadBrand();
    };

    if (loading && !brand) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error || !brand) {
        return (
            <div className="p-6">
                <p className="text-red-500">{error || "Brand not found"}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <BrandView brand={brand} loading={loading} onRefresh={handleRefresh} />
        </div>
    );
}