"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FilterX } from "lucide-react";

interface Props {
    branches: any[];
    onFilterChange: (filters: { orgName: string; status: string }) => void;
}

export default function BranchFilter({ branches, onFilterChange }: Props) {
    const [orgName, setOrgName] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");

    const orgOptions = useMemo(() => {
        const orgs = branches
            .map((b) => b.organization?.name || b.orgName)
            .filter(Boolean);
        return Array.from(new Set(orgs)).sort();
    }, [branches]);

    useEffect(() => {
        onFilterChange({ orgName, status });
    }, [orgName, status, onFilterChange]);

    const clearFilters = () => {
        setOrgName("all");
        setStatus("all");
    };

    const hasFilters = orgName !== "all" || status !== "all";

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Select value={orgName} onValueChange={setOrgName}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Organizations" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Organizations</SelectItem>
                    {orgOptions.map((org) => (
                        <SelectItem key={org} value={org}>
                            {org}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>

            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <FilterX className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            )}
        </div>
    );
}