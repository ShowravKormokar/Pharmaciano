"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterX } from "lucide-react";

interface Props {
    onFilterChange: (filters: { startDate: string; endDate: string }) => void;
    initialStartDate?: string;
    initialEndDate?: string;
}

export default function ReportFilters({ onFilterChange, initialStartDate = "", initialEndDate = "" }: Props) {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    useEffect(() => {
        onFilterChange({ startDate, endDate });
    }, [startDate, endDate, onFilterChange]);

    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
    };

    const hasFilters = startDate || endDate;

    return (
        <div className="grid grid-cols-2 items-end gap-4 bg-muted/30 p-4 rounded-xl border w-full">
            <div className="space-y-1">
                <Label className="text-xs">From</Label>
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">To</Label>
                <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full"
                />
            </div>
            {hasFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                    <FilterX className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            )}
        </div>
    );
}