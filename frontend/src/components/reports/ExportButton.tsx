"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import {
    exportSalesReportToPDF,
    exportSalesReportToCSV,
    printSalesReport,
    exportPurchaseReportToPDF,
    exportPurchaseReportToCSV,
    printPurchaseReport,
    exportInventoryValuationToPDF,
    exportInventoryValuationToCSV,
    printInventoryValuation,
    exportProfitLossToPDF,
    exportProfitLossToCSV,
    printProfitLoss,
} from "@/lib/exportHelpers";

type ReportType = 'sales' | 'purchase' | 'inventory' | 'profitloss';

interface Props {
    reportType: ReportType;
    data: any;
}

export default function ExportButton({ reportType, data }: Props) {
    const handleExport = (format: 'pdf' | 'csv' | 'print') => {
        switch (reportType) {
            case 'sales':
                if (format === 'pdf') exportSalesReportToPDF(data);
                else if (format === 'csv') exportSalesReportToCSV(data);
                else printSalesReport(data);
                break;
            case 'purchase':
                if (format === 'pdf') exportPurchaseReportToPDF(data);
                else if (format === 'csv') exportPurchaseReportToCSV(data);
                else printPurchaseReport(data);
                break;
            case 'inventory':
                if (format === 'pdf') exportInventoryValuationToPDF(data);
                else if (format === 'csv') exportInventoryValuationToCSV(data);
                else printInventoryValuation(data);
                break;
            case 'profitloss':
                if (format === 'pdf') exportProfitLossToPDF(data);
                else if (format === 'csv') exportProfitLossToCSV(data);
                else printProfitLoss(data);
                break;
            default:
                break;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" /> Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('pdf')}>PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('print')}>Print</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}