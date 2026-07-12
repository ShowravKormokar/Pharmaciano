"use client";

import { useEffect, useState } from "react";
import { useSaleStore } from "@/store/sale.store";
import { usePurchaseStore } from "@/store/purchase.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { computeProfitLoss } from "@/lib/reportHelper";
import ReportFilters from "@/components/reports/ReportFilters";
import ReportSummary from "@/components/reports/ReportSummary";
import ReportTable from "@/components/reports/ReportTable";
import ReportSkeleton from "@/components/reports/ReportSkeleton";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import ExportButton from "@/components/reports/ExportButton";

export default function ProfitLossPage() {
    const { sales, fetchSales, loading: salesLoading } = useSaleStore();
    const { purchases, fetchPurchases, loading: purchaseLoading } = usePurchaseStore();
    const [reportData, setReportData] = useState<any>(null);
    const [filters, setFilters] = useState({ startDate: "", endDate: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await Promise.all([fetchSales(), fetchPurchases()]);
            setLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        if (!salesLoading && !purchaseLoading) {
            const data = computeProfitLoss(sales, purchases, filters.startDate, filters.endDate);
            setReportData(data);
        }
    }, [sales, purchases, salesLoading, purchaseLoading, filters]);

    if (loading || !reportData) return <ReportSkeleton />;

    const metrics = [
        { label: "Total Income", value: `TK. ${reportData.totalIncome.toFixed(2)}/-`, color: "text-green-600" },
        { label: "Total Expenses", value: `TK. ${reportData.totalExpenses.toFixed(2)}/-`, color: "text-red-600" },
        { label: "Net Profit", value: `TK. ${reportData.netProfit.toFixed(2)}/-`, color: reportData.netProfit >= 0 ? "text-green-600" : "text-red-600" },
        { label: "Profit Margin", value: `${reportData.totalIncome > 0 ? ((reportData.netProfit / reportData.totalIncome) * 100).toFixed(2) : 0}%` },
    ];

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Profit & Loss</h1>
                    <p className="text-muted-foreground">Income, expenses, and net profit</p>
                </div>
                <ExportButton reportType="profitloss" data={reportData} />
            </div>
            <Card>
                <CardContent className="px-3 py-0">
                    <ReportFilters onFilterChange={setFilters} />
                </CardContent>
            </Card>
            <ReportSummary metrics={metrics} />

            {/* Monthly Trend Chart */}
            <Card>
                <CardHeader><CardTitle>Monthly Trend</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData.monthlyTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => `TK. ${Number(value).toFixed(2)}/-`} />
                            <Legend />
                            <Bar dataKey="income" fill="#22c55e" name="Income" />
                            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                            <Bar dataKey="profit" fill="#3b82f6" name="Net Profit" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Income Breakdown</CardTitle></CardHeader>
                <CardContent>
                    <ReportTable
                        data={reportData.incomeBreakdown}
                        columns={[
                            { key: "source", label: "Source" },
                            { key: "amount", label: "Amount", render: (v: number) => `TK. ${v.toFixed(2)}/-` },
                        ]}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Expense Breakdown</CardTitle></CardHeader>
                <CardContent>
                    <ReportTable
                        data={reportData.expenseBreakdown}
                        columns={[
                            { key: "source", label: "Source" },
                            { key: "amount", label: "Amount", render: (v: number) => `TK. ${v.toFixed(2)}/-` },
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}