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
    warehouses: any[]; // Replace with WarehouseItem type
    onFilterChange: (filters: { branch: string; location: string; status: string }) => void;
}

export default function WarehouseFilter({ warehouses, onFilterChange }: Props) {
    const [branch, setBranch] = useState<string>("all");
    const [location, setLocation] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");

    // Extract unique branch names and locations
    const branchOptions = useMemo(() => {
        const branches = warehouses
            .map((w) => w.branchId?.name || w.branchName)
            .filter(Boolean);
        return Array.from(new Set(branches)).sort();
    }, [warehouses]);

    const locationOptions = useMemo(() => {
        const locs = warehouses.map((w) => w.location).filter(Boolean);
        return Array.from(new Set(locs)).sort();
    }, [warehouses]);

    useEffect(() => {
        onFilterChange({ branch, location, status });
    }, [branch, location, status, onFilterChange]);

    const clearFilters = () => {
        setBranch("all");
        setLocation("all");
        setStatus("all");
    };

    const hasFilters = branch !== "all" || location !== "all" || status !== "all";

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Branch Filter */}
            <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branchOptions.map((b) => (
                        <SelectItem key={b} value={b}>
                            {b}
                        </SelectItem>
                    ))}
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
                        <SelectItem key={loc} value={loc}>
                            {loc}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Status Filter */}
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

            {/* Clear Filters */}
            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <FilterX className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            )}
        </div>
    );
}