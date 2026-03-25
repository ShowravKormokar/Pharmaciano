"use client";

import { useEffect, useState, useMemo } from "react";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Package, Search } from "lucide-react";
import Link from "next/link";
import InventoryBatchTable from "@/components/inventory-batch/InventoryBatchTable";
import InventoryBatchTableSkeleton from "@/components/inventory-batch/InventoryBatchTableSkeleton";
import InventoryBatchFilter from "@/components/inventory-batch/InventoryBatchFilter";

export default function InventoryBatchListPage() {
    const { batches, fetchBatches, loading } = useInventoryBatchStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ status: "all" });

    useEffect(() => {
        fetchBatches();
    }, [fetchBatches]);

    const filteredBatches = useMemo(() => {
        return batches.filter((batch) => {
            const medicineName = typeof batch.medicineId === 'object' ? batch.medicineId?.name : batch.medicineName;
            const matchesSearch =
                !searchTerm.trim() ||
                medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                batch.batchNo?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (filters.status !== "all" && batch.status !== filters.status) return false;

            return true;
        });
    }, [batches, searchTerm, filters]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Inventory Batch List</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage medicine batches, track expiry and stock levels.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/inventory/inventory-batch/add">
                        <Button variant="outline" size="sm">
                            <Package className="h-4 w-4 mr-2" />
                            Create Batch
                        </Button>
                    </Link>
                    <Button size="sm" onClick={fetchBatches} disabled={loading}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search batches..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <InventoryBatchFilter onFilterChange={setFilters} />
            </div>

            {loading ? <InventoryBatchTableSkeleton /> : <InventoryBatchTable batches={filteredBatches} />}
        </div>
    );
}