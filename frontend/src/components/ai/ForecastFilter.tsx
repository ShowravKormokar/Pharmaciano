"use client";

import { useState, useEffect } from "react";
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
import { FilterX } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";
import { useOrganizationStore } from "@/store/organization.store";
import { useBranchStore } from "@/store/branch.store";
import { useForecastStore } from "@/store/aiForecast.store";

export default function ForecastFilter() {
    const { user } = useAuthStore();
    const isSuper = isSuperAdmin(user?.email);
    const { organizations, fetchOrganizations } = useOrganizationStore();
    const { branches, fetchBranches } = useBranchStore();
    const { filters, setFilters, resetFilters, fetchForecast } = useForecastStore();

    const [medicineName, setMedicineName] = useState(filters.medicineName || "");
    const [barcode, setBarcode] = useState(filters.barcode || "");
    const [fromDate, setFromDate] = useState(filters.fromDate || "");
    const [toDate, setToDate] = useState(filters.toDate || "");
    const [orgId, setOrgId] = useState(filters.organizationId || "all");
    const [branchId, setBranchId] = useState(filters.branchId || "all");

    useEffect(() => {
        if (isSuper) {
            fetchOrganizations();
            fetchBranches();
        }
    }, [isSuper, fetchOrganizations, fetchBranches]);

    const applyFilters = () => {
        const newFilters: any = {
            medicineName: medicineName || undefined,
            barcode: barcode || undefined,
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
            page: 1,
        };
        if (isSuper) {
            newFilters.organizationId = orgId !== "all" ? orgId : undefined;
            newFilters.branchId = branchId !== "all" ? branchId : undefined;
        }
        setFilters(newFilters);
        fetchForecast(newFilters);
    };

    const clearFilters = () => {
        setMedicineName("");
        setBarcode("");
        setFromDate("");
        setToDate("");
        setOrgId("all");
        setBranchId("all");
        resetFilters();
        fetchForecast({ page: 1, limit: 10 });
    };

    const hasFilters = medicineName || barcode || fromDate || toDate || (orgId !== "all") || (branchId !== "all");

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <Label className="text-xs">Medicine Name</Label>
                    <Input
                        placeholder="Search by name"
                        value={medicineName}
                        onChange={(e) => setMedicineName(e.target.value)}
                    />
                </div>
                <div>
                    <Label className="text-xs">Barcode</Label>
                    <Input
                        placeholder="Search by barcode"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                    />
                </div>
                <div>
                    <Label className="text-xs">From Date</Label>
                    <Input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div>
                    <Label className="text-xs">To Date</Label>
                    <Input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                {isSuper && (
                    <>
                        <div>
                            <Label className="text-xs">Organization</Label>
                            <Select value={orgId} onValueChange={setOrgId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {organizations.map((org) => (
                                        <SelectItem key={org._id} value={org._id}>
                                            {org.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-xs">Branch</Label>
                            <Select value={branchId} onValueChange={setBranchId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {branches
                                        .filter((b) => !orgId || orgId === "all" || b.organizationId?._id === orgId)
                                        .map((branch) => (
                                            <SelectItem key={branch._id} value={branch._id}>
                                                {branch.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )}
            </div>
            <div className="flex gap-2">
                <Button onClick={applyFilters}>Apply Filters</Button>
                {hasFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                        <FilterX className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}