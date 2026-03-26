"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterX } from "lucide-react";

interface Filters {
    medicine: string;
    startDate: string;
    endDate: string;
}

interface Props {
    onFilterChange: (filters: Filters) => void;
}

export default function SalesFilter({ onFilterChange }: Props) {
    const [medicine, setMedicine] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        onFilterChange({ medicine, startDate, endDate });
    }, [medicine, startDate, endDate, onFilterChange]);

    const clearFilters = () => {
        setMedicine("");
        setStartDate("");
        setEndDate("");
    };

    const hasFilters = medicine || startDate || endDate;

    return (
        <div className="flex flex-wrap items-center gap-3">
            <Input
                placeholder="Search by medicine name"
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
                className="w-48"
            />
            <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-36"
            />
            <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-36"
            />
            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <FilterX className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            )}
        </div>
    );
};