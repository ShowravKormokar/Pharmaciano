"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import OrganizationForm from "@/components/organization/OrganizationForm";
import { useOrganizationStore } from "@/store/organization.store";

export default function AddOrganizationPage() {
    const router = useRouter();
    const resetForm = useOrganizationStore((state) => state.resetForm);

    useEffect(() => {
        resetForm();
    }, [resetForm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New Organization</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <OrganizationForm onSuccess={() => router.push("/dashboard/organizations/list")} />
        </div>
    );
}