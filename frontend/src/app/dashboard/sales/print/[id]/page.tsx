"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSaleStore } from "@/store/sale.store";
import SalesInvoicePrint from "@/components/sales/SalesInvoicePrint";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Printer, Download, Share2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PrintInvoicePage() {
    const { id } = useParams();
    const router = useRouter();
    const { fetchSaleById } = useSaleStore();
    const [sale, setSale] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadSale = async () => {
            if (id && !Array.isArray(id)) {
                const data = await fetchSaleById(id);
                if (data) setSale(data);
            }
            setLoading(false);
        };
        loadSale();
    }, [id, fetchSaleById]);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Invoice_${sale?.invoiceNo || "sale"}`,
    });

    const handleDownloadPDF = async () => {
        if (!printRef.current) return;
        const element = printRef.current;

        try {
            // Capture with onclone to override unsupported colors
            const canvas = await html2canvas(element, {
                scale: 2,
                onclone: (clonedDoc) => {
                    // Inject CSS to replace lab() colors with safe values
                    const style = clonedDoc.createElement('style');
                    style.textContent = `
                        * {
                            color: #000000 !important;
                            background-color: #ffffff !important;
                            border-color: #e5e7eb !important;
                        }
                        .text-gray-600, .text-muted-foreground, .text-gray-500 {
                            color: #4b5563 !important;
                        }
                        table, th, td {
                            border-color: #e5e7eb !important;
                        }
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
            pdf.save(`invoice_${sale?.invoiceNo || sale?._id}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Invoice ${sale?.invoiceNo}`,
                    text: `Sale invoice from ${format(new Date(sale?.createdAt), "PPP")}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Share cancelled or failed", err);
            }
        } else {
            alert("Share not supported on this browser");
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!sale) {
        return <div className="p-6 text-red-500">Sale not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Action Buttons */}
            <div className="text-black max-w-3xl mx-auto mb-4 flex justify-end gap-2 print:hidden">
                <Button variant="outline" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                </Button>
                <Button variant="outline" onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                </Button>
                <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                </Button>
            </div>
            {/* Invoice Content */}
            <div ref={printRef}>
                <SalesInvoicePrint sale={sale} />
            </div>
        </div>
    );
}