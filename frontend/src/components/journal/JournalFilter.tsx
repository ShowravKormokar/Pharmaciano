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
    referenceType: string;
    isReversed: string;
    fromDate: string;
    toDate: string;
}

interface Props {
    onFilterChange: (filters: Filters) => void;
}

export default function JournalFilter({ onFilterChange }: Props) {
    const [referenceType, setReferenceType] = useState("all");
    const [isReversed, setIsReversed] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        onFilterChange({ referenceType, isReversed, fromDate, toDate });
    }, [referenceType, isReversed, fromDate, toDate, onFilterChange]);

    const clearFilters = () => {
        setReferenceType("all");
        setIsReversed("all");
        setFromDate("");
        setToDate("");
    };

    const hasFilters = referenceType !== "all" || isReversed !== "all" || fromDate || toDate;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <Select value={referenceType} onValueChange={setReferenceType}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Reference Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Sale">Sale</SelectItem>
                    <SelectItem value="Purchase">Purchase</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                    <SelectItem value="Drawing">Drawing</SelectItem>
                    <SelectItem value="Capital">Capital</SelectItem>
                </SelectContent>
            </Select>

            <Select value={isReversed} onValueChange={setIsReversed}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Reversed</SelectItem>
                    <SelectItem value="false">Active</SelectItem>
                </SelectContent>
            </Select>

            <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full"
            />
            <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full"
            />

            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <FilterX className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            )}
        </div>
    );
}