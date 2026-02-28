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
    categories: any[];
    onFilterChange: (filters: { status: string }) => void;
}

export default function CategoryFilter({ categories, onFilterChange }: Props) {
    const [status, setStatus] = useState<string>("all");

    useEffect(() => {
        onFilterChange({ status });
    }, [status, onFilterChange]);

    const clearFilters = () => {
        setStatus("all");
    };

    const hasFilters = status !== "all";

    return (
        <div className="flex flex-wrap items-center gap-2">
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