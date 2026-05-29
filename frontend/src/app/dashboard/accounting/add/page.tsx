"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AccountForm from "@/components/account/AccountForm";
import { useAccountStore } from "@/store/account.store";

export default function AddAccountPage() {
    const router = useRouter();
    const resetForm = useAccountStore((state) => state.resetForm);

    useEffect(() => {
        resetForm();
    }, [resetForm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New Account</h1>
                <Button variant="outline" onClick={() => router.back()}>Back</Button>
            </div>
            <AccountForm onSuccess={() => router.push("/dashboard/accounting/accounts/list")} />
        </div>
    );
}