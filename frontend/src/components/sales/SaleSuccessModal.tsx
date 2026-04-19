"use client";

import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, X } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useSaleStore } from "@/store/sale.store";
import { SaleItem } from "@/types/sale";
import SalesInvoicePrint from "./SalesInvoicePrint";

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

    const handleDownload = async () => {
        if (sale?._id) {
            await generateInvoicePdf(sale._id);
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