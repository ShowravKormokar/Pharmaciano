"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrganizationStore } from "@/store/organization.store";
import { Button } from "@/components/ui/button";
import OrganizationView from "@/components/organization/OrganizationView";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewOrganizationPage() {
    const { id } = useParams();
    const router = useRouter();
    const { organizations, fetchOrganizations, loading } = useOrganizationStore();
    const [organization, setOrganization] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadOrg = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid organization ID");
                return;
            }

            if (organizations.length === 0 && !loading) {
                await fetchOrganizations();
            }

            const found = organizations.find((o) => o._id === id);
            if (!found) {
                setError("Organization not found");
                return;
            }

            setOrganization(found);
        };

        loadOrg();
    }, [id, organizations, loading, fetchOrganizations]);

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

    if (loading || !organization) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <OrganizationView organization={organization} />
        </div>
    );
}