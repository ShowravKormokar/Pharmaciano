"use client";

import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, X } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useSaleStore } from "@/store/sale.store";
import { SaleItem } from "@/types/sale";
import SalesInvoicePrint from "./SalesInvoicePrint";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Props {
    sale: SaleItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function SaleSuccessModal({ sale, open, onOpenChange }: Props) {
    const printRef = useRef<HTMLDivElement>(null);
    const { generateInvoicePdf } = useSaleStore();

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Invoice_${sale?.invoiceNo || "sale"}`,
    });

    // Client‑side PDF download (no backend call)
    const handleDownload = async () => {
        if (!printRef.current) return;
        const element = printRef.current;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                onclone: (clonedDoc) => {
                    // Override unsupported colors (like lab() )
                    const style = clonedDoc.createElement('style');
                    style.textContent = `
                        * { color: #000000 !important; background-color: #ffffff !important; border-color: #e5e7eb !important; }
                        .text-gray-600, .text-muted-foreground, .text-gray-500 { color: #4b5563 !important; }
                        table, th, td { border-color: #e5e7eb !important; }
                    `;
                    clonedDoc.head.appendChild(style);
                }
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(`invoice_${sale?.invoiceNo || "sale"}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    if (!sale) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Sale Completed Successfully!</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex justify-end gap-2 sticky top-0 bg-background py-2 z-10">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="outline" onClick={handleDownload}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            <X className="h-4 w-4 mr-2" />
                            Close
                        </Button>
                    </div>
                    <div ref={printRef}>
                        <SalesInvoicePrint sale={sale} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}