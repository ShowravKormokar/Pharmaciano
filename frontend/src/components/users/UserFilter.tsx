"use client";

import { useState, useEffect } from "react";
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
    users: any[]; // to extract available roles
    onFilterChange: (filters: { role: string; status: string }) => void;
}

export default function UserFilter({ users, onFilterChange }: Props) {
    const [role, setRole] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");

    // Get unique role names from users (excluding empty)
    const roleOptions = Array.from(
        new Set(
            users
                .map((u) => u.roleId?.name)
                .filter(Boolean)
        )
    ).sort();

    // Notify parent when filters change
    useEffect(() => {
        onFilterChange({ role, status });
    }, [role, status, onFilterChange]);

    const clearFilters = () => {
        setRole("all");
        setStatus("all");
    };

    const hasFilters = role !== "all" || status !== "all";

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/* Role Filter */}
            <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roleOptions.map((roleName) => (
                        <SelectItem key={roleName} value={roleName}>
                            {roleName}
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