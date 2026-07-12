"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterX } from "lucide-react";

interface Filters {
    name: string;
    phone: string;
    minOrders: number;
}

interface Props {
    onFilterChange: (filters: Filters) => void;
}

export default function CustomerFilter({ onFilterChange }: Props) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [minOrders, setMinOrders] = useState<number>(0);

    useEffect(() => {
        onFilterChange({ name, phone, minOrders });
    }, [name, phone, minOrders, onFilterChange]);

    const clearFilters = () => {
        setName("");
        setPhone("");
        setMinOrders(0);
    };

    const hasFilters = name || phone || minOrders > 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end bg-muted/30 p-4 rounded-xl border">
            <div className="space-y-1">
                <Label className="text-xs">Name</Label>
                <Input
                    placeholder="Search by name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Phone</Label>
                <Input
                    placeholder="Search by phone..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full"
                />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Min. Orders</Label>
                <Input
                    type="number"
                    placeholder="0"
                    value={minOrders}
                    onChange={(e) => setMinOrders(parseInt(e.target.value) || 0)}
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