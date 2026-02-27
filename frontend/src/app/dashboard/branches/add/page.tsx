"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BranchForm from "@/components/branch/BranchForm";
import { useBranchStore } from "@/store/branch.store";

export default function AddBranchPage() {
    const router = useRouter();
    const resetForm = useBranchStore((state) => state.resetForm);

    useEffect(() => {
        resetForm();
    }, [resetForm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New Branch</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <BranchForm onSuccess={() => router.push("/dashboard/branches/branch-list")} />
        </div>
    );
}