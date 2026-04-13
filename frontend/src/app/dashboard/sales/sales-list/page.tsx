"use client";

import { useEffect, useState, useMemo } from "react";
import { useSaleStore } from "@/store/sale.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SalesTable from "@/components/sales/SalesTable";
import SalesTableSkeleton from "@/components/sales/SalesTableSkeleton";
import SalesExport from "@/components/sales/SalesExport";
import SalesFilter, { Filters } from "@/components/sales/SalesFilter";

export default function SalesListPage() {
    const { sales, pagination, loading, fetchSales } = useSaleStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<Filters>({
        medicine: "",
        startDate: "",
        endDate: "",
        paymentMethod: "all",
        organization: "all",
        branch: "all",
    });
    const limit = 10;

    // Debounced search (affects backend fetch)
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchSales(1, limit, searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, fetchSales]);

    // Fetch on page change
    useEffect(() => {
        fetchSales(currentPage, limit, searchTerm);
    }, [currentPage, fetchSales, searchTerm]);

    // Client‑side filtering (applied after fetch)
    const filteredSales = useMemo(() => {
        let result = [...sales];

        if (filters.medicine.trim()) {
            const med = filters.medicine.toLowerCase().replace(/\s+/g, "");

            result = result.filter((sale) =>
                sale.items.some((item) => {
                    const name1 = item.medicineName?.toLowerCase().replace(/\s+/g, "") || "";
                    const name2 = item.medicineId?.name?.toLowerCase().replace(/\s+/g, "") || "";

                    return name1.includes(med) || name2.includes(med);
                })
            );
        }

        // Date range
        if (filters.startDate) {
            result = result.filter(
                sale => new Date(sale.createdAt) >= new Date(filters.startDate)
            );
        }
        if (filters.endDate) {
            result = result.filter(
                sale => new Date(sale.createdAt) <= new Date(filters.endDate)
            );
        }

        // Payment method
        if (filters.paymentMethod !== "all") {
            result = result.filter(sale => sale.paymentMethod === filters.paymentMethod);
        }

        // Organization (only for super admin)
        if (filters.organization !== "all") {
            result = result.filter(
                sale => sale.organizationId?.name === filters.organization
            );
        }

        // Branch (only for super admin)
        if (filters.branch !== "all") {
            result = result.filter(sale => sale.branchId?.name === filters.branch);
        }

        return result;
    }, [sales, filters]);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= Math.ceil(pagination.total / limit)) {
            setCurrentPage(page);
        }
    };

    const totalPages = Math.ceil(pagination.total / limit);

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(i)}
                    className="w-8 h-8 p-0"
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Sales List</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage all sales transactions
                    </p>
                </div>
                <div className="flex gap-2">
                    <SalesExport sales={filteredSales} />
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <SalesFilter
                        onFilterChange={setFilters}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </CardContent>
            </Card>

            {/* Sales Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>List of all sales transactions</CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Total: <span className="font-semibold text-foreground">{pagination.total}</span> sales
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <SalesTableSkeleton />
                    ) : (
                        <>
                            <SalesTable sales={filteredSales} />
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    {renderPageNumbers()}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}