"use client";

import { useState, useEffect } from "react";
import { useSaleStore } from "@/store/sale.store";
import { useMedicineStore } from "@/store/medicine.store";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Props {
    saleId?: string;
    onSuccess?: () => void;
}

export default function SalesForm({ saleId, onSuccess }: Props) {
    const {
        cart,
        customerName,
        customerPhone,
        discount,
        tax,
        paymentMethod,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        setCustomer,
        setDiscount,
        setTax,
        setPaymentMethod,
        createSale,
        updateSale,
    } = useSaleStore();

    const [submitting, setSubmitting] = useState(false);

    const { medicines, fetchMedicines } = useMedicineStore();
    const { batches, fetchBatches } = useInventoryBatchStore();

    const [searchMedicine, setSearchMedicine] = useState("");
    const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
    const [selectedBatch, setSelectedBatch] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchMedicines();
        fetchBatches();
    }, [fetchMedicines, fetchBatches]);

    // Filter medicines based on search
    const filteredMedicines = medicines.filter((med) =>
        med.name.toLowerCase().includes(searchMedicine.toLowerCase())
    );

    const handleAddToCart = () => {
        if (!selectedBatch) {
            toast.error("Please select a batch");
            return;
        }
        if (quantity <= 0) {
            toast.error("Quantity must be positive");
            return;
        }
        // Optional: check stock quantity from batch (selectedBatch.quantity)
        if (selectedBatch.quantity < quantity) {
            toast.error(`Only ${selectedBatch.quantity} units available in this batch`);
            return;
        }
        addToCart(
            {
                medicineName: selectedMedicine.name,
                batchNo: selectedBatch.batchNo,
                sellingPrice: selectedMedicine.unitPrice,
            },
            quantity
        );
        // Reset selection
        setSelectedMedicine(null);
        setSelectedBatch(null);
        setQuantity(1);
        setSearchMedicine("");
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const success = saleId ? await updateSale(saleId) : await createSale();
        if (success && onSuccess) {
            setTimeout(onSuccess, 1500);
        }
        setSubmitting(false);
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const discountAmount = (subtotal * discount) / 100;
        const taxAmount = ((subtotal - discountAmount) * tax) / 100;
        return subtotal - discountAmount + taxAmount;
    };

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart Section */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Shopping Cart</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {cart.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">Cart is empty</p>
                        ) : (
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <div
                                        key={item.batchNo}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium capitalize">{item.medicineName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Batch: {item.batchNo} | Price: Tk {item.sellingPrice.toFixed(2)}/-
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateCartQuantity(item.batchNo, parseInt(e.target.value) || 0)
                                                }
                                                className="w-20"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFromCart(item.batchNo)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Customer & Payment */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer & Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Customer Name *"
                            value={customerName}
                            onChange={(e) => setCustomer({ customerName: e.target.value })}
                        />
                        <Input
                            placeholder="Customer Phone *"
                            value={customerPhone}
                            onChange={(e) => setCustomer({ customerPhone: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="pb-2">Discount (%)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={discount}
                                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div>
                                <Label className="pb-2">Tax (%)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={tax}
                                    onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="pb-2">Payment Method</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                    <SelectItem value="mobile">Mobile Banking</SelectItem>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Medicine Selection */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Medicine</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search medicine..."
                                value={searchMedicine}
                                onChange={(e) => setSearchMedicine(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        {searchMedicine && filteredMedicines.length > 0 && (
                            <div className="border rounded-md p-2 space-y-1 max-h-48 overflow-auto">
                                {filteredMedicines.map((med) => (
                                    <button
                                        key={med._id}
                                        onClick={() => {
                                            setSelectedMedicine(med);
                                            setSearchMedicine(med.name);
                                        }}
                                        className="w-full text-left px-2 py-1 hover:bg-muted rounded capitalize"
                                    >
                                        {med.name} - {med.strength} {med.unit}
                                    </button>
                                ))}
                            </div>
                        )}
                        {selectedMedicine && (
                            <>
                                <div>
                                    <Label className="pb-2">Select Batch</Label>
                                    <Select
                                        value={selectedBatch?.batchNo || ""}
                                        onValueChange={(batchNo) => {
                                            const batch = batches.find((b) => b.batchNo === batchNo);
                                            setSelectedBatch(batch);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select batch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {batches
                                                .filter((b) => {
                                                    const medName =
                                                        typeof b.medicineId === "object"
                                                            ? b.medicineId?.name
                                                            : b.medicineName;
                                                    return medName === selectedMedicine.name;
                                                })
                                                .map((batch) => (
                                                    <SelectItem key={batch._id} value={batch.batchNo}>
                                                        {batch.batchNo} (Qty: {batch.quantity})
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="pb-2">Quantity</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <Button onClick={handleAddToCart} className="w-full">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Discount ({discount}%):</span>
                            <span>-${((calculateSubtotal() * discount) / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Tax ({tax}%):</span>
                            <span>+${(((calculateSubtotal() - (calculateSubtotal() * discount) / 100) * tax) / 100).toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        {/* ================= BUTTONS ================= */}
                        <div className="flex gap-3">
                            <Button
                                className="w-1/2"
                                onClick={handleSubmit}
                                disabled={submitting || cart.length === 0}
                            >
                                {submitting
                                    ? "Processing..."
                                    : saleId
                                        ? "Update Sale"
                                        : "Complete Sale"}
                            </Button>

                            {!saleId && (
                                <Button
                                    className="w-1/2"
                                    type="button"
                                    variant="outline"
                                    onClick={clearCart}
                                    disabled={submitting}
                                >
                                    Reset Cart
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};