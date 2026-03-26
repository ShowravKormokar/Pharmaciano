// app/dashboard/sales/sales-list/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useSaleStore } from "@/store/sale.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search } from "lucide-react";
import SalesTable from "@/components/sales/SalesTable";
import SalesTableSkeleton from "@/components/sales/SalesTableSkeleton";
import SalesFilter from "@/components/sales/SalesFilter";
import { format } from "date-fns";
import SalesExport from "@/components/sales/SalesExport";

export default function SalesListPage() {
    const { sales, fetchSales, loading } = useSaleStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ medicine: "", startDate: "", endDate: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch sales when medicine filter changes
    useEffect(() => {
        fetchSales(filters.medicine || undefined);
    }, [fetchSales, filters.medicine]);

    // Apply search and date filters
    const filteredSales = useMemo(() => {
        let result = [...sales];
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(
                (sale) =>
                    sale.invoiceNo.toLowerCase().includes(lower) ||
                    (sale.customerName?.toLowerCase().includes(lower))
            );
        }
        if (filters.startDate) {
            result = result.filter(
                (sale) => new Date(sale.createdAt) >= new Date(filters.startDate)
            );
        }
        if (filters.endDate) {
            result = result.filter(
                (sale) => new Date(sale.createdAt) <= new Date(filters.endDate)
            );
        }
        return result;
    }, [sales, searchTerm, filters]);

    // Sort by date descending (most recent first)
    const sortedSales = useMemo(() => {
        return [...filteredSales].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [filteredSales]);

    // Paginate
    const totalPages = Math.ceil(sortedSales.length / itemsPerPage);
    const paginatedSales = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedSales.slice(start, start + itemsPerPage);
    }, [sortedSales, currentPage]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    // Pagination controls
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

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

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by invoice ID, customer name..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <SalesFilter onFilterChange={setFilters} />
                    </div>
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
                        Total: <span className="font-semibold text-foreground">{filteredSales.length}</span> sales |{" "}
                        <span className="font-semibold text-foreground">TK. {totalAmount.toLocaleString()}/-</span>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <SalesTableSkeleton />
                    ) : (
                        <>
                            <SalesTable sales={paginatedSales} />
                            {/* Pagination Controls */}
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