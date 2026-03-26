"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
// I need install: npm install xlsx jspdf jspdf-autotable
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { useAuthStore } from "@/store/auth.store";

interface Props {
    sales: any[]; // SaleItem[]
}

export default function SalesExport({ sales }: Props) {
    const [isExporting, setIsExporting] = useState(false);
    const { user, loading } = useAuthStore();

    const exportToCSV = () => {
        const data = sales.map(sale => ({
            "Invoice No": sale.invoiceNo,
            "Customer": sale.customerName || "Walk-in",
            "Date": format(new Date(sale.createdAt), "PPP"),
            "Total Amount": sale.totalAmount,
            "Payment Method": sale.paymentMethod,
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
        XLSX.writeFile(workbook, `sales_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Sales Report", 20, 20);
        doc.setFontSize(10);
        doc.text(`Exported by: ${user?.name}`, 20, 30);
        doc.text(`Date: ${format(new Date(), "PPP p")}`, 20, 38);

        const tableData = sales.map(sale => [
            sale.invoiceNo,
            sale.customerName || "Walk-in",
            format(new Date(sale.createdAt), "PPP"),
            `${sale.totalAmount.toFixed(2)}/-`,
            sale.paymentMethod,
        ]);

        autoTable(doc, {
            head: [["Invoice", "Customer", "Date", "Amount(Tk)", "Payment"]],
            body: tableData,
            startY: 45,
            theme: "grid",
        });

        doc.save(`sales_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    };

    const handleExport = (format: "csv" | "pdf") => {
        setIsExporting(true);
        try {
            if (format === "csv") exportToCSV();
            else if (format === "pdf") exportToPDF();
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                onClick={() => handleExport("csv")}
                disabled={isExporting || sales.length === 0}
            >
                <Download className="h-4 w-4 mr-2" />
                CSV
            </Button>
            <Button
                variant="outline"
                onClick={() => handleExport("pdf")}
                disabled={isExporting || sales.length === 0}
            >
                <Download className="h-4 w-4 mr-2" />
                PDF
            </Button>
        </div>
    );
}