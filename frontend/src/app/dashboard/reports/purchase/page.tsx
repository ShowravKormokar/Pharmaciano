"use client";

import { useEffect, useState } from "react";
import { usePurchaseStore } from "@/store/purchase.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { computePurchaseReport } from "@/lib/reportHelper";
import ReportFilters from "@/components/reports/ReportFilters";
import ReportSummary from "@/components/reports/ReportSummary";
import ReportTable from "@/components/reports/ReportTable";
import ReportSkeleton from "@/components/reports/ReportSkeleton";
import ExportButton from "@/components/reports/ExportButton";

export default function PurchaseReportPage() {
    const { purchases, fetchPurchases, loading } = usePurchaseStore();
    const [reportData, setReportData] = useState<any>(null);
    const [filters, setFilters] = useState({ startDate: "", endDate: "" });

    useEffect(() => {
        fetchPurchases();
    }, []);

    useEffect(() => {
        if (!loading && purchases.length > 0) {
            const data = computePurchaseReport(purchases, filters.startDate, filters.endDate);
            setReportData(data);
        } else {
            setReportData(null);
        }
    }, [purchases, loading, filters]);

    if (loading || !reportData) return <ReportSkeleton />;

    const metrics = [
        { label: "Total Spent", value: `TK. ${reportData.totalPurchases.toFixed(2)}/-` },
        { label: "Total Orders", value: reportData.totalOrders },
        { label: "Average Order Value", value: `TK. ${reportData.averageOrderValue.toFixed(2)}/-` },
        { label: "Top Supplier", value: reportData.topSuppliers.length > 0 ? reportData.topSuppliers[0].name : "N/A" },
    ];

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Purchase Report</h1>
                    <p className="text-muted-foreground">Overview of purchase orders</p>
                </div>
                <ExportButton reportType="purchase" data={reportData} />
            </div>
            <Card>
                <CardContent className="px-3 py-0">
                    <ReportFilters onFilterChange={setFilters} />
                </CardContent>
            </Card>
            <ReportSummary metrics={metrics} />
            <Card>
                <CardHeader>
                    <CardTitle>Purchases by Day</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReportTable
                        data={reportData.purchasesByDate}
                        columns={[
                            { key: "date", label: "Date" },
                            { key: "orders", label: "Orders" },
                            { key: "total", label: "Amount", render: (v: number) => `TK. ${v.toFixed(2)}/-` },
                        ]}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Top Suppliers</CardTitle></CardHeader>
                <CardContent>
                    <ReportTable
                        data={reportData.topSuppliers}
                        columns={[
                            { key: "name", label: "Supplier" },
                            { key: "total", label: "Total", render: (v: number) => `TK. ${v.toFixed(2)}/-` },
                        ]}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Payment Status Breakdown</CardTitle></CardHeader>
                <CardContent>
                    <ReportTable
                        data={reportData.paymentStatusBreakdown}
                        columns={[
                            { key: "status", label: "Status" },
                            { key: "total", label: "Amount", render: (v: number) => `TK. ${v.toFixed(2)}/-` },
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}