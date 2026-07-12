"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FilterX } from "lucide-react";

interface Filters {
    type: string;
    isActive: string;
}

interface Props {
    onFilterChange: (filters: Filters) => void;
}

export default function AccountFilter({ onFilterChange }: Props) {
    const [type, setType] = useState("all");
    const [isActive, setIsActive] = useState("all");

    useEffect(() => {
        onFilterChange({ type, isActive });
    }, [type, isActive, onFilterChange]);

    const clearFilters = () => {
        setType("all");
        setIsActive("all");
    };

    const hasFilters = type !== "all" || isActive !== "all";

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 items-center gap-3 w-full">
            <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Account Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="asset">Asset</SelectItem>
                    <SelectItem value="liability">Liability</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                </SelectContent>
            </Select>

            <Select value={isActive} onValueChange={setIsActive}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
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