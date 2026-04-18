"use client";

import { useEffect, useState } from "react";
import { usePurchaseStore } from "@/store/purchase.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Search, Download } from "lucide-react";
import PurchaseTable from "@/components/purchase/PurchaseTable";
import PurchaseTableSkeleton from "@/components/purchase/PurchaseTableSkeleton";
import PurchaseFilter from "@/components/purchase/PurchaseFilter";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export default function PurchaseListPage() {
    const {
        purchases,
        pagination,
        stats,
        loading,
        fetchPurchases,
    } = usePurchaseStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        status: "all",
        paymentStatus: "all",
        fromDate: "",
        toDate: "",
    });

    const limit = 10;

    useEffect(() => {
        const params: any = {
            page: currentPage,
            limit,
        };

        if (searchTerm) params.search = searchTerm;
        if (filters.status !== "all") params.status = filters.status;
        if (filters.paymentStatus !== "all")
            params.paymentStatus = filters.paymentStatus;
        if (filters.fromDate) params.fromDate = filters.fromDate;
        if (filters.toDate) params.toDate = filters.toDate;

        fetchPurchases(params);
    }, [currentPage, searchTerm, filters, fetchPurchases]);

    const totalPages = Math.ceil(pagination.total / limit);

    const exportToCSV = () => {
        const data = purchases.map((p) => ({
            "Purchase No": p.purchaseNo,
            Supplier: p.supplierId.name,
            Date: format(new Date(p.createdAt), "PPP"),
            "Total Amount": p.totalAmount,
            Status: p.status,
            Payment: p.paymentStatus,
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Purchases");
        XLSX.writeFile(
            wb,
            `purchases_${format(new Date(), "yyyy-MM-dd")}.xlsx`
        );
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        doc.text("Purchase Report", 20, 10);
        doc.text(`Generated: ${format(new Date(), "PPP p")}`, 20, 20);

        const tableData = purchases.map((p) => [
            p.purchaseNo,
            p.supplierId.name,
            format(new Date(p.createdAt), "PPP"),
            p.totalAmount.toFixed(2),
            p.status,
            p.paymentStatus,
        ]);

        autoTable(doc, {
            head: [
                ["Purchase No", "Supplier", "Date", "Amount", "Status", "Payment"],
            ],
            body: tableData,
            startY: 30,
        });

        doc.save(
            `purchases_${format(new Date(), "yyyy-MM-dd")}.pdf`
        );
    };

    return (
        <div className="space-y-6 p-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Purchase List
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all purchase orders
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportToCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                    </Button>

                    <Button variant="outline" onClick={exportToPDF}>
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                    </Button>
                </div>
            </div>

            {/* Search + Filter */}
            <Card>
                <CardContent className="p-6 space-y-4">

                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by purchase no, supplier..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <PurchaseFilter onFilterChange={setFilters} />

                </CardContent>
            </Card>

            {/* Table */}
            <Card>

                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Purchases</CardTitle>
                        <CardDescription>
                            List of all purchase orders
                        </CardDescription>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Total: {pagination.total} | Pending: {stats.pending} |
                        Approved: {stats.approved} | Received: {stats.received}
                    </div>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <PurchaseTableSkeleton />
                    ) : (
                        <>
                            <PurchaseTable purchases={purchases} />

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-6">

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((p) => Math.max(1, p - 1))
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>

                                    <span className="text-sm">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(totalPages, p + 1)
                                            )
                                        }
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
};