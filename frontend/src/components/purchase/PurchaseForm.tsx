"use client";

import { useEffect, useState } from "react";
import { usePurchaseStore } from "@/store/purchase.store";
import { useSupplierStore } from "@/store/supplier.store";
import { useWarehouseStore } from "@/store/warehouse.store";
import { useMedicineStore } from "@/store/medicine.store";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Props {
    purchaseId?: string;
    onSuccess?: () => void;
}

export default function PurchaseForm({ purchaseId, onSuccess }: Props) {
    const { form, setForm, createPurchase, updatePurchase, resetForm } = usePurchaseStore();
    const { suppliers, fetchSuppliers } = useSupplierStore();
    const { warehouses, fetchWarehouses } = useWarehouseStore();
    const { medicines, fetchMedicines } = useMedicineStore();
    const { user } = useAuthStore();
    const isSuper = isSuperAdmin(user?.email);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSuppliers();
        fetchWarehouses();
        fetchMedicines();
    }, [fetchSuppliers, fetchWarehouses, fetchMedicines]);

    const addItem = () => setForm({ items: [...form.items, { medicineName: "", quantity: 1 }] });
    const removeItem = (index: number) => {
        const newItems = [...form.items];
        newItems.splice(index, 1);
        setForm({ items: newItems });
    };
    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...form.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setForm({ items: newItems });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const success = purchaseId ? await updatePurchase(purchaseId) : await createPurchase();
        if (success && onSuccess) setTimeout(onSuccess, 1500);
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Purchase Information</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                    {/* Organization + Branch */}
                    {isSuper && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-primary pl-1 pb-1">
                                    Organization Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={form.organizationName}
                                    onChange={(e) => setForm({ organizationName: e.target.value })}
                                    placeholder="Enter organization name"
                                />
                            </div>

                            <div>
                                <Label className="text-primary pl-1 pb-1">
                                    Branch Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={form.branchName}
                                    onChange={(e) => setForm({ branchName: e.target.value })}
                                    placeholder="Enter branch name"
                                />
                            </div>
                        </div>
                    )}

                    {/* Supplier + Warehouse */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-primary pl-1 pb-1">
                                Supplier <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={form.supplier}
                                onValueChange={(val) => setForm({ supplier: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map((s) => (
                                        <SelectItem key={s._id} value={s.name}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-primary pl-1 pb-1">
                                Warehouse <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={form.warehouseName}
                                onValueChange={(val) => setForm({ warehouseName: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select warehouse" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.map((w) => (
                                        <SelectItem key={w._id} value={w.name}>
                                            {w.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                        <Label className="text-primary pl-1 pb-1">
                            Items <span className="text-red-500">*</span>
                        </Label>

                        {form.items.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-end">

                                <div className="flex-1">
                                    <Select
                                        value={item.medicineName}
                                        onValueChange={(val) =>
                                            updateItem(idx, "medicineName", val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Medicine" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {medicines.map((m) => (
                                                <SelectItem key={m._id} value={m.name}>
                                                    {m.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="w-24">
                                    <Input
                                        type="number"
                                        placeholder="Qty"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateItem(
                                                idx,
                                                "quantity",
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                    />
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem(idx)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addItem}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                        </Button>
                    </div>

                    {/* Payment Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-primary pl-1 pb-1">
                                Payment Status <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={form.paymentStatus}
                                onValueChange={(val) =>
                                    setForm({ paymentStatus: val })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unpaid">Unpaid</SelectItem>
                                    <SelectItem value="partial">Partial</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-primary pl-1 pb-1">
                                Paid Amount
                            </Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={form.paidAmount}
                                onChange={(e) =>
                                    setForm({
                                        paidAmount: parseFloat(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="text-primary pl-1 pb-1">
                                Discount (%)
                            </Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={form.discount}
                                onChange={(e) =>
                                    setForm({
                                        discount: parseFloat(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="text-primary pl-1 pb-1">
                                Tax (%)
                            </Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={form.tax}
                                onChange={(e) =>
                                    setForm({
                                        tax: parseFloat(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
                <Button
                    className="w-1/2"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting
                        ? "Processing..."
                        : purchaseId
                            ? "Update Purchase"
                            : "Create Purchase"}
                </Button>

                {!purchaseId && (
                    <Button
                        className="w-1/2"
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        disabled={submitting}
                    >
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
}