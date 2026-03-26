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
    onFilterChange: (filters: { orgName: string; location: string; status: string }) => void;
}

export default function BranchFilter({ branches, onFilterChange }: Props) {
    const [orgName, setOrgName] = useState<string>("all");
    const [location, setLocation] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");

    const orgOptions = useMemo(() => {
        const orgs = branches
            .map((b) => b.organization?.name || b.orgName)
            .filter(Boolean);
        return Array.from(new Set(orgs)).sort();
    }, [branches]);

    const locationOptions = useMemo(() => {
        const locs = branches.map((w) => w.address).filter(Boolean);
        return Array.from(new Set(locs)).sort();
    }, [branches]);

    useEffect(() => {
        onFilterChange({ orgName, location, status });
    }, [orgName, location, status, onFilterChange]);

    const clearFilters = () => {
        setOrgName("all");
        setLocation("all");
        setStatus("all");
    };

    const hasFilters = orgName !== "all" || location !== "all" || status !== "all";

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* <Select value={orgName} onValueChange={setOrgName}>
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
            </Select> */}

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

            {/* Location Filter */}
            <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locationOptions.map((loc) => (
                        <SelectItem key={loc} value={loc} className="capitalize">
                            {loc}
                        </SelectItem>
                    ))}
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