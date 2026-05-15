"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePurchaseStore } from "@/store/purchase.store";
import { PurchaseItem } from "@/types/purchase";
import { toast } from "sonner";

interface Props {
    purchase: PurchaseItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PaySupplierModal({ purchase, open, onOpenChange }: Props) {
    const { paySupplier } = usePurchaseStore();
    const [amount, setAmount] = useState(purchase.dueAmount);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (amount <= 0) {
            toast.error("Amount must be greater than 0");
            return;
        }
        if (amount > purchase.dueAmount) {
            toast.error(`Amount cannot exceed due amount (${purchase.dueAmount})`);
            return;
        }
        setLoading(true);
        const success = await paySupplier(purchase._id, amount);
        if (success) onOpenChange(false);
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pay Supplier – {purchase.purchaseNo}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Due Amount</Label>
                        <p className="text-lg font-bold">TK. {purchase.dueAmount.toFixed(2)}/-</p>
                    </div>
                    <div>
                        <Label className="pb-2">Payment Amount:</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                        {loading ? "Processing..." : "Confirm Payment"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}