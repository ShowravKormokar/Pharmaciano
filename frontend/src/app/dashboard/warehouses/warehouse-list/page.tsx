"use client";

import { useEffect, useState, useMemo } from "react";
import { useWarehouseStore } from "@/store/warehouse.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Warehouse, Search } from "lucide-react";
import Link from "next/link";
import WarehouseTable from "@/components/warehouse/WarehouseTable";
import WarehouseTableSkeleton from "@/components/warehouse/WarehouseTableSkeleton";
import WarehouseFilter from "@/components/warehouse/WarehouseFilter";

export default function WarehouseListPage() {
    const { warehouses, fetchWarehouses, loading } = useWarehouseStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ branch: "all", location: "all", status: "all" });

    useEffect(() => {
        fetchWarehouses();
    }, [fetchWarehouses]);

    const filteredWarehouses = useMemo(() => {
        return warehouses.filter((warehouse) => {
            // Search filter (name, location, branch)
            const matchesSearch =
                !searchTerm.trim() ||
                warehouse.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                warehouse.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                warehouse.branchId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                warehouse.branchName?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            // Branch filter
            if (filters.branch !== "all") {
                const branch = warehouse.branchId?.name || warehouse.branchName;
                if (branch !== filters.branch) return false;
            }

            // Location filter
            if (filters.location !== "all" && warehouse.location !== filters.location) {
                return false;
            }

            // Status filter
            if (filters.status !== "all") {
                const isActive = filters.status === "active";
                if (warehouse.isActive !== isActive) return false;
            }

            return true;
        });
    }, [warehouses, searchTerm, filters]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Warehouse List</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage warehouses and their details.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/warehouse/add">
                        <Button variant="outline" size="sm">
                            <Warehouse className="h-4 w-4 mr-2" />
                            Create Warehouse
                        </Button>
                    </Link>
                    <Button size="sm" onClick={fetchWarehouses} disabled={loading}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search warehouses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <WarehouseFilter warehouses={warehouses} onFilterChange={setFilters} />
            </div>

            {loading ? (
                <WarehouseTableSkeleton />
            ) : (
                <WarehouseTable warehouses={filteredWarehouses} />
            )}
        </div>
    );
}