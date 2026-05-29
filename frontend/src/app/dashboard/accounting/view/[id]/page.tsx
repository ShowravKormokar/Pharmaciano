"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccountStore } from "@/store/account.store";
import { Button } from "@/components/ui/button";
import AccountView from "@/components/account/AccountView";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewAccountPage() {
    const { id } = useParams();
    const router = useRouter();
    const { fetchAccountById } = useAccountStore();
    const [account, setAccount] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid ID");
                setLoading(false);
                return;
            }
            const data = await fetchAccountById(id);
            if (data) setAccount(data);
            else setError("Account not found");
            setLoading(false);
        };
        load();
    }, [id, fetchAccountById]);

    if (loading) return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;
    if (error) return <div className="p-6">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
    </div>;
    return <div className="p-6"><AccountView account={account} /></div>;
}