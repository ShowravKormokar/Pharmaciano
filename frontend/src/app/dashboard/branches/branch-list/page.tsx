"use client";

import { useEffect, useState, useMemo } from "react";
import { useBranchStore } from "@/store/branch.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Building2, Search } from "lucide-react";
import Link from "next/link";
import BranchTable from "@/components/branch/BranchTable";
import BranchTableSkeleton from "@/components/branch/BranchTableSkeleton";
import BranchFilter from "@/components/branch/BranchFilter";

export default function BranchListPage() {
    const { branches, fetchBranches, loading } = useBranchStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ orgName: "all", status: "all" });

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const filteredBranches = useMemo(() => {
        return branches.filter((branch) => {
            const matchesSearch =
                !searchTerm.trim() ||
                branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                branch.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                branch.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                branch.contact?.phone?.includes(searchTerm);

            if (!matchesSearch) return false;

            if (filters.orgName !== "all") {
                const org = branch.organization?.name || branch.orgName;
                if (org !== filters.orgName) return false;
            }

            if (filters.status !== "all") {
                const isActive = filters.status === "active";
                if (branch.isActive !== isActive) return false;
            }

            return true;
        });
    }, [branches, searchTerm, filters]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Branch List</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage branches and their contact details.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/branches/add">
                        <Button variant="outline" size="sm">
                            <Building2 className="h-4 w-4 mr-2" />
                            Create Branch
                        </Button>
                    </Link>
                    <Button size="sm" onClick={fetchBranches} disabled={loading}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search branches..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <BranchFilter branches={branches} onFilterChange={setFilters} />
            </div>

            {loading ? (
                <BranchTableSkeleton />
            ) : (
                <BranchTable branches={filteredBranches} />
            )}
        </div>
    );
}