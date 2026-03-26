"use client";

import { SaleItem } from "@/types/sale";
import { format } from "date-fns";

interface Props {
    sale: SaleItem;
}

export default function SalesInvoicePrint({ sale }: Props) {
    const invoiceDisplay = sale.invoiceNo || `INV-${sale._id.slice(-5)}`;

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-md print:shadow-none">
            {/* Header */}
            <div className="text-center border-b border-gray-300 pb-4 mb-4">
                <h1 className="text-2xl text-black font-bold capitalize">{sale.organizationId?.name || "PHARMACIANO"}</h1>
                <p className="text-sm text-gray-600 capitalize">{sale.organizationId?.address}</p>
                <p className="text-sm text-black">Invoice: {invoiceDisplay}</p>
            </div>

            {/* Organization & Branch */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="capitalize text-gray-800">
                    <p className="font-semibold text-black">Branch:</p>
                    <p>{sale.branchId?.name || "N/A"}</p>
                    <p>{sale.branchId?.address}</p>
                </div>
            </div>

            {/* Sale Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-800">
                <div>
                    <p className="capitalize"><span className="font-semibold text-black">Cashier:</span> {sale.cashierId?.name}</p>
                    <p><span className="font-semibold">Date:</span> {format(new Date(sale.createdAt), "PPP p")}</p>
                </div>
                <div>
                    <p className="capitalize"><span className="font-semibold text-black">Customer:</span> {sale.customerName || "Walk-in"}</p>
                    {sale.customerPhone && <p><span className="font-semibold">Phone:</span> {sale.customerPhone}</p>}
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-gray-300 text-black">
                        <th className="text-left py-2">Medicine</th>
                        <th className="text-left py-2">Batch</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {sale.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-300 text-gray-800">
                            <td className="py-2 capitalize">{item.medicineName}</td>
                            <td className="py-2">{item.batchNo}</td>
                            <td className="text-right py-2">{item.quantity}</td>
                            <td className="text-right py-2">Tk {item.sellingPrice.toFixed(2)}/-</td>
                            <td className="text-right py-2">Tk {(item.sellingPrice * item.quantity).toFixed(2)}/-</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="mt-4 flex justify-end">
                <div className="w-64 space-y-1">
                    <div className="flex justify-between text-gray-700">
                        <span className="text-black">Subtotal:</span>
                        <span>Tk {sale.subtotal.toFixed(2)}/-</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span className="text-black">Discount ({sale.discount}%):</span>
                        <span>-Tk {((sale.subtotal * sale.discount) / 100).toFixed(2)}/-</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span className="text-black">Tax ({sale.tax}%):</span>
                        <span>+Tk {(((sale.subtotal - (sale.subtotal * sale.discount) / 100) * sale.tax) / 100).toFixed(2)}/-</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
                        <span className="text-black">Total:</span>
                        <span className="text-black">Tk {sale.totalAmount.toFixed(2)}/-</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-gray-300 text-black">
                        <span>Payment Method:</span>
                        <span className="capitalize">{sale.paymentMethod}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
                <p>Thank you for your purchase!</p>
                <p>Printed on {format(new Date(), "PPP p")}</p>
            </div>
        </div>
    );
}