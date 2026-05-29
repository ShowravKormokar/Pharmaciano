"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccountStore } from "@/store/account.store";
import { Button } from "@/components/ui/button";
import AccountForm from "@/components/account/AccountForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditAccountPage() {
    const { id } = useParams();
    const router = useRouter();
    const { fetchAccountById, setForm, resetForm } = useAccountStore();
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
            if (data) {
                setForm({
                    name: data.name,
                    type: data.type,
                    code: data.code,
                    isActive: data.isActive,
                    organizationName: data.organizationId?.name || "",
                });
            } else {
                setError("Account not found");
            }
            setLoading(false);
        };
        load();
        return () => resetForm();
    }, [id, fetchAccountById, setForm, resetForm]);

    if (loading) return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;
    if (error) return <div className="p-6"><p className="text-red-500">{error}</p><Button onClick={() => router.back()}>Go Back</Button></div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Edit Account</h1>
                <Button variant="outline" onClick={() => router.back()}>Back</Button>
            </div>
            <AccountForm accountId={id as string} onSuccess={() => router.push("/dashboard/accounting/accounts/list")} />
        </div>
    );
}