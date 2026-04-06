"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FilterX, Search } from "lucide-react";

interface FilterValues {
    status: string;
    medicineName: string;
    batchNo: string;
}

interface Props {
    onFilterChange: (filters: FilterValues) => void;
    initialFilters?: Partial<FilterValues>;
}

export default function InventoryBatchFilter({ onFilterChange, initialFilters = {} }: Props) {
    const [status, setStatus] = useState<string>(initialFilters.status || "all");
    const [medicineName, setMedicineName] = useState<string>(initialFilters.medicineName || "");
    const [batchNo, setBatchNo] = useState<string>(initialFilters.batchNo || "");

    // Debounce to avoid too many API calls while typing
    const debouncedMedicine = useDebounce(medicineName, 500);
    const debouncedBatchNo = useDebounce(batchNo, 500);

    useEffect(() => {
        onFilterChange({
            status: status === "all" ? "" : status,
            medicineName: debouncedMedicine,
            batchNo: debouncedBatchNo,
        });
    }, [status, debouncedMedicine, debouncedBatchNo, onFilterChange]);

    const clearFilters = () => {
        setStatus("all");
        setMedicineName("");
        setBatchNo("");
    };

    const hasFilters = status !== "all" || medicineName || batchNo;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                </SelectContent>
            </Select>

            <Input
                placeholder="Medicine name"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                className="w-48"
            />
            <Input
                placeholder="Batch No."
                value={batchNo}
                onChange={(e) => setBatchNo(e.target.value)}
                className="w-40"
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

// Simple debounce hook (if not already present)
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}