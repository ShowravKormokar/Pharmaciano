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
    organizations: any[];
    onFilterChange: (filters: { plan: string; status: string }) => void;
}

export default function OrganizationFilter({ organizations, onFilterChange }: Props) {
    const [plan, setPlan] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");

    const planOptions = useMemo(() => {
        const plans = organizations.map((o) => o.subscriptionPlan).filter(Boolean);
        return Array.from(new Set(plans)).sort();
    }, [organizations]);

    useEffect(() => {
        onFilterChange({ plan, status });
    }, [plan, status, onFilterChange]);

    const clearFilters = () => {
        setPlan("all");
        setStatus("all");
    };

    const hasFilters = plan !== "all" || status !== "all";

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Plans" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    {planOptions.map((p) => (
                        <SelectItem key={p} value={p}>
                            {p}
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