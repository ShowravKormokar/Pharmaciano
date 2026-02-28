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
    brands: any[];
    onFilterChange: (filters: { manufacturer: string; country: string; status: string }) => void;
}

export default function BrandFilter({ brands, onFilterChange }: Props) {
    const [manufacturer, setManufacturer] = useState<string>("all");
    const [country, setCountry] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");

    const manufacturerOptions = useMemo(() => {
        return Array.from(new Set(brands.map((b) => b.manufacturer).filter(Boolean))).sort();
    }, [brands]);

    const countryOptions = useMemo(() => {
        return Array.from(new Set(brands.map((b) => b.country).filter(Boolean))).sort();
    }, [brands]);

    useEffect(() => {
        onFilterChange({ manufacturer, country, status });
    }, [manufacturer, country, status, onFilterChange]);

    const clearFilters = () => {
        setManufacturer("all");
        setCountry("all");
        setStatus("all");
    };

    const hasFilters = manufacturer !== "all" || country !== "all" || status !== "all";

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Select value={manufacturer} onValueChange={setManufacturer}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Manufacturers" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Manufacturers</SelectItem>
                    {manufacturerOptions.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countryOptions.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
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