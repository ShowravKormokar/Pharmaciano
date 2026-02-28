"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBrandStore } from "@/store/brand.store";
import { Button } from "@/components/ui/button";
import BrandForm from "@/components/brand/BrandForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditBrandPage() {
    const { id } = useParams();
    const router = useRouter();
    const { brands, fetchBrands, setForm } = useBrandStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBrand = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid brand ID");
                setLoading(false);
                return;
            }

            let brand = brands.find((b) => b._id === id);
            if (!brand && brands.length === 0) {
                await fetchBrands();
                brand = brands.find((b) => b._id === id);
            }

            if (!brand) {
                setError("Brand not found");
                setLoading(false);
                return;
            }

            setForm({
                name: brand.name,
                manufacturer: brand.manufacturer,
                country: brand.country,
                isActive: brand.isActive,
            });
            setLoading(false);
        };

        loadBrand();
    }, [id, brands, fetchBrands, setForm]);

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
                <h1 className="text-2xl font-bold">Edit Brand</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <BrandForm brandId={id as string} onSuccess={() => router.push("/dashboard/inventory/brands/brand-list")} />
        </div>
    );
}