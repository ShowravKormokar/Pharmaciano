"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSaleStore } from "@/store/sale.store";
import { Button } from "@/components/ui/button";
import SalesView from "@/components/sales/SalesView";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewSalePage() {
    const { id } = useParams();
    const router = useRouter();
    const { sales, fetchSaleById } = useSaleStore();
    const [sale, setSale] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSale = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid sale ID");
                setLoading(false);
                return;
            }

            let found = sales.find((s) => s._id === id);
            if (found) {
                setSale(found);
                setLoading(false);
                return;
            }

            const result = await fetchSaleById(id as string);
            if (result) {
                setSale(result);
            } else {
                setError("Sale not found");
            }
            setLoading(false);
        };

        loadSale();
    }, [id, sales, fetchSaleById]);

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error || !sale) {
        return (
            <div className="p-6">
                <p className="text-red-500">{error || "Sale not found"}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <SalesView sale={sale} />
        </div>
    );
}