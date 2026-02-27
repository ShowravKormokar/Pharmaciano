"use client";

import { useEffect, useState, useMemo } from "react";
import { useOrganizationStore } from "@/store/organization.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Building2, Search } from "lucide-react";
import Link from "next/link";
import OrganizationTable from "@/components/organization/OrganizationTable";
import OrganizationTableSkeleton from "@/components/organization/OrganizationTableSkeleton";
import OrganizationFilter from "@/components/organization/OrganizationFilter";

export default function OrganizationListPage() {
    const { organizations, fetchOrganizations, loading } = useOrganizationStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ plan: "all", status: "all" });

    useEffect(() => {
        fetchOrganizations();
    }, [fetchOrganizations]);

    const filteredOrganizations = useMemo(() => {
        return organizations.filter((org) => {
            const matchesSearch =
                !searchTerm.trim() ||
                org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                org.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                org.contact.phone.includes(searchTerm);

            if (!matchesSearch) return false;

            if (filters.plan !== "all" && org.subscriptionPlan !== filters.plan) return false;
            if (filters.status !== "all") {
                const isActive = filters.status === "active";
                if (org.isActive !== isActive) return false;
            }
            return true;
        });
    }, [organizations, searchTerm, filters]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Organization List</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage organizations and their subscription plans.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/organizations/add">
                        <Button variant="outline" size="sm">
                            <Building2 className="h-4 w-4 mr-2" />
                            Create Organization
                        </Button>
                    </Link>
                    <Button size="sm" onClick={fetchOrganizations} disabled={loading}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search organizations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <OrganizationFilter organizations={organizations} onFilterChange={setFilters} />
            </div>

            {loading ? (
                <OrganizationTableSkeleton />
            ) : (
                <OrganizationTable organizations={filteredOrganizations} />
            )}
        </div>
    );
}