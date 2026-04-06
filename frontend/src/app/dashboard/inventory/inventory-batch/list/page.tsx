"use client";

import { useEffect, useState } from "react";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Package } from "lucide-react";
import Link from "next/link";
import InventoryBatchTable from "@/components/inventory-batch/InventoryBatchTable";
import InventoryBatchTableSkeleton from "@/components/inventory-batch/InventoryBatchTableSkeleton";
import InventoryBatchFilter from "@/components/inventory-batch/InventoryBatchFilter";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function InventoryBatchListPage() {
    const { batches, meta, loading, fetchBatches } = useInventoryBatchStore();
    const [filters, setFilters] = useState({ status: "", medicineName: "", batchNo: "" });
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        fetchBatches({
            page,
            limit,
            status: filters.status || undefined,
            medicineName: filters.medicineName || undefined,
            batchNo: filters.batchNo || undefined,
        });
    }, [fetchBatches, page, filters]);

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        setPage(1); // reset to first page when filters change
    };

    const totalPages = meta ? Math.ceil(meta.count / limit) : 0;

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
                    <Button
                        size="sm"
                        onClick={() => fetchBatches({ page, limit, ...filters })}
                        disabled={loading}
                    >
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <InventoryBatchFilter onFilterChange={handleFilterChange} />

            {loading ? (
                <InventoryBatchTableSkeleton />
            ) : (
                <>
                    <InventoryBatchTable batches={batches} />
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <Pagination>
                                <PaginationContent>

                                    {/* Previous */}
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page > 1) setPage(page - 1);
                                            }}
                                        />
                                    </PaginationItem>

                                    {/* Page Numbers */}
                                    {Array.from({ length: totalPages }, (_, i) => {
                                        const pageNumber = i + 1;

                                        return (
                                            <PaginationItem key={pageNumber}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={page === pageNumber}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setPage(pageNumber);
                                                    }}
                                                >
                                                    {pageNumber}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    {/* Next */}
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page < totalPages) setPage(page + 1);
                                            }}
                                        />
                                    </PaginationItem>

                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}