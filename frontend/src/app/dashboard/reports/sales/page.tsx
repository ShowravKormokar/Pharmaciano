"use client";

import { useEffect, useState } from "react";
import { useSaleStore } from "@/store/sale.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { computeSalesReport } from "@/lib/reportHelper";
import ReportFilters from "@/components/reports/ReportFilters";
import ReportTable from "@/components/reports/ReportTable";
import ReportSkeleton from "@/components/reports/ReportSkeleton";
import ReportSummary from "@/components/reports/ReportSummary";
import ExportButton from "@/components/reports/ExportButton";

export default function SalesReportPage() {
    const { sales, fetchSales, loading } = useSaleStore();
    const [reportData, setReportData] = useState<any>(null);
    const [filters, setFilters] = useState({ startDate: "", endDate: "" });

    useEffect(() => {
        fetchSales();
    }, []);

    useEffect(() => {
        if (!loading && sales.length > 0) {
            const data = computeSalesReport(sales, filters.startDate, filters.endDate);
            setReportData(data);
        } else {
            setReportData(null);
        }
    }, [sales, loading, filters]);

    if (loading || !reportData) return <ReportSkeleton />;

    const metrics = [
        { label: "Total Revenue", value: `TK. ${reportData.totalSales.toFixed(2)}/-` },
        { label: "Total Orders", value: reportData.totalOrders },
        { label: "Average Order Value", value: `TK. ${reportData.averageOrderValue.toFixed(2)}/-` },
        { label: "Top Product", value: reportData.topProducts.length > 0 ? reportData.topProducts[0].name : "N/A" },
    ];

    const columns = [
        { key: "date", label: "Date" },
        { key: "orders", label: "Orders" },
        { key: "total", label: "Revenue", render: (v: number) => `TK. ${v.toFixed(2)}/-` },
    ];

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Sales Report</h1>
                    <p className="text-muted-foreground">Overview of sales performance</p>
                </div>
                <ExportButton reportType="sales" data={reportData} />
            </div>

            <Card>
                <CardContent className="px-3 py-0">
                    <ReportFilters onFilterChange={setFilters} />
                </CardContent>
            </Card>

            <ReportSummary metrics={metrics} />

            <Card>
                <CardHeader>
                    <CardTitle>Sales by Day</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReportTable data={reportData.salesByDate} columns={columns} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReportTable
                        data={reportData.topProducts}
                        columns={[
                            { key: "name", label: "Product" },
                            { key: "quantity", label: "Qty Sold" },
                            { key: "revenue", label: "Revenue", render: (v: number) => `TK. ${v.toFixed(2)}/-` },
                        ]}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Method Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReportTable
                        data={reportData.paymentMethodBreakdown}
                        columns={[
                            { key: "method", label: "Method" },
                            { key: "total", label: "Amount", render: (v: number) => `TK. ${v.toFixed(2)}/-` },
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}