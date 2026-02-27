"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBranchStore } from "@/store/branch.store";
import { Button } from "@/components/ui/button";
import BranchForm from "@/components/branch/BranchForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditBranchPage() {
    const { id } = useParams();
    const router = useRouter();
    const { branches, fetchBranches, setForm } = useBranchStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBranch = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid branch ID");
                setLoading(false);
                return;
            }

            let branch = branches.find((b) => b._id === id);
            if (!branch && branches.length === 0) {
                await fetchBranches();
                branch = branches.find((b) => b._id === id);
            }

            if (!branch) {
                setError("Branch not found");
                setLoading(false);
                return;
            }

            setForm({
                name: branch.name,
                address: branch.address,
                contact: branch.contact,
                orgName: branch.organization?.name || branch.orgName || "",
                isActive: branch.isActive,
            });
            setLoading(false);
        };

        loadBranch();
    }, [id, branches, fetchBranches, setForm]);

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
                <h1 className="text-2xl font-bold">Edit Branch</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <BranchForm branchId={id as string} onSuccess={() => router.push("/dashboard/branches/branch-list")} />
        </div>
    );
}