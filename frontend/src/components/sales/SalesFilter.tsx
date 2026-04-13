"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FilterX, Search } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useUniqueNamesStore } from "@/store/uniqueNames.store";

export interface Filters {
    medicine: string;
    startDate: string;
    endDate: string;
    paymentMethod: string;
    organization: string;
    branch: string;
}

interface Props {
    onFilterChange: (filters: Filters) => void;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

export default function SalesFilter({
    onFilterChange,
    searchTerm,
    setSearchTerm,
}: Props) {
    const { user } = useAuthStore();
    const { getOrganizationNames, getBranchNames, fetchUniqueNames, data } =
        useUniqueNamesStore();

    const [medicine, setMedicine] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("all");
    const [organization, setOrganization] = useState("all");
    const [branch, setBranch] = useState("all");

    const isSuper = user?.email === "superadmin@pharmaciano.com";

    useEffect(() => {
        if (isSuper && !data) fetchUniqueNames();
    }, [isSuper, data, fetchUniqueNames]);

    const organizationOptions = useMemo(
        () => (isSuper ? getOrganizationNames() : []),
        [isSuper, getOrganizationNames]
    );

    const branchOptions = useMemo(
        () => (isSuper ? getBranchNames() : []),
        [isSuper, getBranchNames]
    );

    useEffect(() => {
        onFilterChange({
            medicine,
            startDate,
            endDate,
            paymentMethod,
            organization,
            branch,
        });
    }, [medicine, startDate, endDate, paymentMethod, organization, branch]);

    const clearFilters = () => {
        setMedicine("");
        setStartDate("");
        setEndDate("");
        setPaymentMethod("all");
        setOrganization("all");
        setBranch("all");
    };

    const hasFilters =
        medicine ||
        startDate ||
        endDate ||
        paymentMethod !== "all" ||
        organization !== "all" ||
        branch !== "all";

    return (
        <div className="space-y-5 w-full">
            {/*  Search */}
            <div className="relative md:max-w-full rounded-xl border">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search invoice or customer..."
                    className="pl-9 h-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-end bg-muted/30 p-4 rounded-xl border">
                <div className="space-y-1">
                    <Label className="text-xs">Medicine</Label>
                    <Input
                        placeholder="e.g napa"
                        value={medicine}
                        onChange={(e) => setMedicine(e.target.value)}
                        className="w-44"
                    />
                </div>

                <div className="space-y-1">
                    <Label className="text-xs">From</Label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-36"
                    />
                </div>

                <div className="space-y-1">
                    <Label className="text-xs">To</Label>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-36"
                    />
                </div>

                <div className="space-y-1">
                    <Label className="text-xs">Payment</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="w-36">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="mobile">Mobile</SelectItem>
                            <SelectItem value="bank_transfer">Bank</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {isSuper && (
                    <>
                        <div className="space-y-1">
                            <Label className="text-xs">Organization</Label>
                            <Select value={organization} onValueChange={setOrganization}>
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {organizationOptions.map((org) => (
                                        <SelectItem key={org} value={org}>
                                            {org}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs">Branch</Label>
                            <Select value={branch} onValueChange={setBranch}>
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {branchOptions.map((br) => (
                                        <SelectItem key={br} value={br}>
                                            {br}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )}

                {hasFilters && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                        <FilterX className="h-4 w-4 mr-1" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
};