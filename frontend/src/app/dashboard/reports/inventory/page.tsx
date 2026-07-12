"use client";

import { useEffect, useState } from "react";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { useMedicineStore } from "@/store/medicine.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { computeInventoryValuation } from "@/lib/reportHelper";
import ReportSummary from "@/components/reports/ReportSummary";
import ReportTable from "@/components/reports/ReportTable";
import ReportSkeleton from "@/components/reports/ReportSkeleton";
import ExportButton from "@/components/reports/ExportButton";

export default function InventoryValuationPage() {
    const { batches, fetchBatches, loading: batchLoading } = useInventoryBatchStore();
    const { medicines, fetchMedicines, loading: medLoading } = useMedicineStore();
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await Promise.all([fetchBatches(), fetchMedicines()]);
            setLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        if (!batchLoading && !medLoading && batches.length > 0) {
            const data = computeInventoryValuation(batches, medicines);
            setReportData(data);
        } else {
            setReportData(null);
        }
    }, [batches, medicines, batchLoading, medLoading]);

    if (loading || !reportData) return <ReportSkeleton />;

    const metrics = [
        { label: "Total Items", value: reportData.totalItems },
        { label: "Total Value (Cost)", value: `TK. ${reportData.totalValue.toFixed(2)}/-` },
        { label: "Total Selling Value", value: `TK. ${reportData.totalSellingValue.toFixed(2)}/-` },
    ];

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Inventory Valuation</h1>
                    <p className="text-muted-foreground">Current inventory worth</p>
                </div>
                <ExportButton reportType="inventory" data={reportData} />
            </div>
            <ReportSummary metrics={metrics} />
            <Card>
                <CardHeader><CardTitle>Valuation by Batch</CardTitle></CardHeader>
                <CardContent>
                    <ReportTable
                        data={reportData.valuationByBatch}
                        columns={[
                            { key: "batchNo", label: "Batch No" },
                            { key: "medicineName", label: "Medicine" },
                            { key: "quantity", label: "Qty" },
                            { key: "value", label: "Value", render: (v: number) => `TK. ${v.toFixed(2)}/-` },
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}