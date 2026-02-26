"use client";

import { useEffect, useState, useMemo } from "react";
import { useWarehouseStore } from "@/store/warehouse.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Warehouse, Search } from "lucide-react";
import Link from "next/link";
import WarehouseTable from "@/components/warehouse/WarehouseTable";
import WarehouseTableSkeleton from "@/components/warehouse/WarehouseTableSkeleton";

export default function WarehouseListPage() {
    const { warehouses, fetchWarehouses, loading } = useWarehouseStore();
    const [searchTerm, setSearchTerm] = useState("");

    const loadWarehouses = async () => {
        await fetchWarehouses();
    };

    useEffect(() => {
        loadWarehouses();
    }, []);

    const filteredWarehouses = useMemo(() => {
        if (!searchTerm.trim()) return warehouses;
        const term = searchTerm.toLowerCase();
        return warehouses.filter(
            (w) =>
                w.name.toLowerCase().includes(term) ||
                w.location.toLowerCase().includes(term) ||
                w.branchName?.toLowerCase().includes(term) ||
                w.branchId?.name?.toLowerCase().includes(term)
        );
    }, [warehouses, searchTerm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Warehouse List
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage warehouses, locations and capacity.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/dashboard/warehouses/add">
                        <Button variant="outline" size="sm">
                            <Warehouse className="h-4 w-4 mr-2" />
                            Create Warehouse
                        </Button>
                    </Link>
                    <Button size="sm" onClick={loadWarehouses} disabled={loading}>
                        <RefreshCcw
                            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search warehouses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                />
            </div>

            {loading ? (
                <WarehouseTableSkeleton />
            ) : (
                <WarehouseTable warehouses={filteredWarehouses} />
            )}
        </div>
    );
}