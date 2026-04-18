"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterX } from "lucide-react";

interface Filters {
    status: string;
    paymentStatus: string;
    fromDate: string;
    toDate: string;
}

interface Props {
    onFilterChange: (filters: Filters) => void;
}

export default function PurchaseFilter({ onFilterChange }: Props) {
    const [status, setStatus] = useState("all");
    const [paymentStatus, setPaymentStatus] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        onFilterChange({ status, paymentStatus, fromDate, toDate });
    }, [status, paymentStatus, fromDate, toDate, onFilterChange]);

    const clearFilters = () => {
        setStatus("all");
        setPaymentStatus("all");
        setFromDate("");
        setToDate("");
    };

    const hasFilters = status !== "all" || paymentStatus !== "all" || fromDate || toDate;

    return (
        <div className="flex flex-wrap items-center gap-3">
            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                </SelectContent>
            </Select>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Payment" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
            </Select>
            <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-36"
            />
            <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-36"
            />
            {
                hasFilters &&
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <FilterX className="h-4 w-4 mr-1" /> Clear
                </Button>
            }
        </div>
    );
}