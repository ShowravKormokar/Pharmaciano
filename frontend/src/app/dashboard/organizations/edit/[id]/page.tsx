"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrganizationStore } from "@/store/organization.store";
import { Button } from "@/components/ui/button";
import OrganizationForm from "@/components/organization/OrganizationForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditOrganizationPage() {
    const { id } = useParams();
    const router = useRouter();
    const { organizations, fetchOrganizations, setForm } = useOrganizationStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadOrganization = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid organization ID");
                setLoading(false);
                return;
            }

            let org = organizations.find((o) => o._id === id);
            if (!org && organizations.length === 0) {
                await fetchOrganizations();
                org = organizations.find((o) => o._id === id);
            }

            if (!org) {
                setError("Organization not found");
                setLoading(false);
                return;
            }

            setForm({
                name: org.name,
                tradeLicenseNo: org.tradeLicenseNo || "",
                drugLicenseNo: org.drugLicenseNo || "",
                vatRegistrationNo: org.vatRegistrationNo || "",
                address: org.address || "",
                contactPhone: org.contact.phone,
                contactEmail: org.contact.email,
                subscriptionPlan: org.subscriptionPlan,
                isActive: org.isActive,
            });
            setLoading(false);
        };

        loadOrganization();
    }, [id, organizations, fetchOrganizations, setForm]);

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
                <h1 className="text-2xl font-bold">Edit Organization</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <OrganizationForm organizationId={id as string} onSuccess={() => router.push("/dashboard/organizations/org-list")} />
        </div>
    );
}