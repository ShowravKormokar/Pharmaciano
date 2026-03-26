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

export default function SalesListPage() {
    const { sales, fetchSales, loading } = useSaleStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ medicine: "", startDate: "", endDate: "" });

    useEffect(() => {
        fetchSales(filters.medicine || undefined);
    }, [fetchSales, filters.medicine]);

    const filteredSales = useMemo(() => {
        let result = [...sales];
        // Apply search (invoice or customer name)
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(
                (sale) =>
                    sale.invoiceNo.toLowerCase().includes(lower) ||
                    (sale.customerName?.toLowerCase().includes(lower))
            );
        }
        // Apply date range
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

    const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Sales List</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage all sales transactions
                    </p>
                </div>
                <Button variant="outline" onClick={() => { /* export logic */ }}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
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
                        <SalesTable sales={filteredSales} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};