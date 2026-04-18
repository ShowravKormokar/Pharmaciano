"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePurchaseStore } from "@/store/purchase.store";
import { PurchaseItem } from "@/types/purchase";

interface Props {
    purchase: PurchaseItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ReceivePurchaseModal({ purchase, open, onOpenChange }: Props) {
    const { receivePurchase } = usePurchaseStore();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState(
        purchase.items.map(item => ({
            medicineName: item.medicineName,
            batchNo: item.batchNo || "",
            expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : "",
            purchasePrice: item.purchasePrice,
        }))
    );
    const [paymentStatus, setPaymentStatus] = useState<"unpaid" | "partial" | "paid">(purchase.paymentStatus);
    const [paidAmount, setPaidAmount] = useState(purchase.paidAmount);
    const [discount, setDiscount] = useState(purchase.discount);
    const [tax, setTax] = useState(purchase.tax);

    const handleSubmit = async () => {
        setLoading(true);
        const success = await receivePurchase(purchase._id, { items, paymentStatus, paidAmount, discount, tax });
        if (success) onOpenChange(false);
        setLoading(false);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Receive Purchase: {purchase.purchaseNo}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Batch Details</Label>
                        {items.map((item, idx) => (
                            <div key={idx} className="border rounded p-3 space-y-2">
                                <p className="font-medium">{item.medicineName}</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input placeholder="Batch No" value={item.batchNo} onChange={(e) => updateItem(idx, "batchNo", e.target.value)} />
                                    <Input type="date" placeholder="Expiry Date" value={item.expiryDate} onChange={(e) => updateItem(idx, "expiryDate", e.target.value)} />
                                    <Input type="number" step="0.01" placeholder="Purchase Price" value={item.purchasePrice} onChange={(e) => updateItem(idx, "purchasePrice", parseFloat(e.target.value))} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="payment-status">Payment Status</Label>
                            <select
                                id="payment-status"
                                aria-label="Payment Status"
                                className="w-full border rounded p-2"
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value as "unpaid" | "partial" | "paid")}
                            >
                                <option value="unpaid">Unpaid</option>
                                <option value="partial">Partial</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                        <div>
                            <Label>Paid Amount</Label>
                            <Input type="number" step="0.01" value={paidAmount} onChange={(e) => setPaidAmount(parseFloat(e.target.value))} />
                        </div>
                        <div>
                            <Label>Discount (%)</Label>
                            <Input type="number" step="0.01" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value))} />
                        </div>
                        <div>
                            <Label>Tax (%)</Label>
                            <Input type="number" step="0.01" value={tax} onChange={(e) => setTax(parseFloat(e.target.value))} />
                        </div>
                    </div>
                    <Button onClick={handleSubmit} disabled={loading} className="w-full">{loading ? "Processing..." : "Confirm Receive"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};