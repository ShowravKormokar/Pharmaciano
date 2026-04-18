"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePurchaseStore } from "@/store/purchase.store";
import { Button } from "@/components/ui/button";
import PurchaseView from "@/components/purchase/PurchaseView";
import { Skeleton } from "@/components/ui/skeleton";
import { PurchaseItem } from "@/types/purchase";

export default function ViewPurchasePage() {
    const { id } = useParams();
    const router = useRouter();
    const { fetchPurchaseById } = usePurchaseStore();
    const [purchase, setPurchase] = useState<PurchaseItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid ID"); setLoading(false);
                return;
            }
            const data = await fetchPurchaseById(id);
            if (data) setPurchase(data);
            else setError("Purchase not found");

            setLoading(false);
        };
        load();
    }, [id, fetchPurchaseById]);


    if (loading) {
        return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;
    }
    if (error) {
        return <div className="p-6"><p className="text-red-500">{error}</p><Button onClick={() => router.back()}>Go Back</Button></div>;
    }

    if (!purchase) return null;
    return (
        <div className="p-6">
            <PurchaseView purchase={purchase} />
        </div>
    );
};