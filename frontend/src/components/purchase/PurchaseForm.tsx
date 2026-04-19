"use client";

import { useEffect, useMemo, useState } from "react";
import { usePurchaseStore } from "@/store/purchase.store";
import { useSupplierStore } from "@/store/supplier.store";
import { useWarehouseStore } from "@/store/warehouse.store";
import { useOrganizationStore } from "@/store/organization.store";
import { useBranchStore } from "@/store/branch.store";
import { useUniqueNamesStore } from "@/store/uniqueNames.store";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";

import { Plus, Trash2 } from "lucide-react";

interface Props {
    purchaseId?: string;
    onSuccess?: () => void;
}

export default function PurchaseForm({ purchaseId, onSuccess }: Props) {
    const { form, setForm, createPurchase, updatePurchase, resetForm } =
        usePurchaseStore();

    const { suppliers, fetchSuppliers } = useSupplierStore();
    const { warehouses, fetchWarehouses } = useWarehouseStore();
    const { organizations, fetchOrganizations } = useOrganizationStore();
    const { branches, fetchBranches } = useBranchStore();

    const { getMedicineNames, unqNameloading } = useUniqueNamesStore();

    const { user } = useAuthStore();
    const isSuper = isSuperAdmin(user?.email);

    const [submitting, setSubmitting] = useState(false);

    const [supplierQuery, setSupplierQuery] = useState("");
    const [medicineQuery, setMedicineQuery] = useState("");
    const [medicineQueries, setMedicineQueries] = useState<Record<number, string>>({});

    // FETCH
    useEffect(() => {
        fetchSuppliers();
        fetchWarehouses();
        fetchOrganizations();
        fetchBranches();
    }, [fetchSuppliers, fetchWarehouses, fetchOrganizations, fetchBranches]);

    // FILTER
    const filteredBranches = useMemo(() => {
        if (!form.organizationName) return branches;
        return branches.filter(
            (b) =>
                b.organizationId?.name?.toLowerCase() ===
                form.organizationName?.toLowerCase()
        );
    }, [branches, form.organizationName]);

    const filteredWarehouses = useMemo(() => {
        if (form.branchName) {
            return warehouses.filter(
                (w) => w.branchId?.name === form.branchName
            );
        }
        return warehouses;
    }, [warehouses, form.branchName]);

    const medicineNames = getMedicineNames();

    const getFilteredMedicines = (query: string) => {
        if (!query) return medicineNames;
        return medicineNames.filter((m) =>
            m.toLowerCase().includes(query.toLowerCase())
        );
    };

    const filteredSuppliers = useMemo(() => {
        if (!supplierQuery) return suppliers;
        return suppliers.filter((s) =>
            s.name.toLowerCase().includes(supplierQuery.toLowerCase())
        );
    }, [suppliers, supplierQuery]);

    // ITEMS
    const addItem = () =>
        setForm({
            items: [...form.items, { medicineName: "", quantity: 1 }],
        });

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

    // SUBMIT
    const handleSubmit = async () => {
        setSubmitting(true);
        const success = purchaseId
            ? await updatePurchase(purchaseId)
            : await createPurchase();

        if (success && onSuccess) setTimeout(onSuccess, 1500);
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <Card>

                <CardContent className="space-y-6">

                    {/* ORG + BRANCH */}
                    {isSuper && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <Label className="text-primary pl-1 pb-1">
                                    Organization <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={form.organizationName}
                                    onValueChange={(val) =>
                                        setForm({
                                            organizationName: val,
                                            branchName: "",
                                            warehouseName: "",
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizations.map((org) => (
                                            <SelectItem key={org._id} value={org.name}>
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-primary pl-1 pb-1">
                                    Branch <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={form.branchName}
                                    onValueChange={(val) =>
                                        setForm({ branchName: val, warehouseName: "" })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredBranches.map((b) => (
                                            <SelectItem key={b._id} value={b.name}>
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* SUPPLIER + WAREHOUSE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Supplier Combobox */}
                        <div>
                            <Label className="text-primary pl-1 pb-1">
                                Supplier <span className="text-red-500">*</span>
                            </Label>

                            <Combobox
                                value={form.supplier}
                                onValueChange={(val) => {
                                    setForm({ supplier: val || "" });
                                    setSupplierQuery(val || "");
                                }}
                            >
                                <ComboboxInput
                                    placeholder="Search supplier"
                                    value={supplierQuery}
                                    onChange={(e) => setSupplierQuery(e.target.value)}
                                />
                                <ComboboxContent>
                                    <ComboboxList>
                                        {filteredSuppliers.length > 0 ? (
                                            filteredSuppliers.map((s) => (
                                                <ComboboxItem key={s._id} value={s.name}>
                                                    {s.name}
                                                </ComboboxItem>
                                            ))
                                        ) : (
                                            <ComboboxEmpty>No supplier found</ComboboxEmpty>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>

                        {/* Warehouse */}
                        <div>
                            <Label className="text-primary pl-1 pb-1">
                                Warehouse <span className="text-red-500">*</span>
                            </Label>

                            <Select
                                value={form.warehouseName}
                                onValueChange={(val) =>
                                    setForm({ warehouseName: val })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select warehouse" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredWarehouses.map((w) => (
                                        <SelectItem key={w._id} value={w.name}>
                                            {w.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ITEMS */}
                    <div className="space-y-3">
                        <Label className="text-primary pl-1 pb-1">
                            Items <span className="text-red-500">*</span>
                        </Label>

                        {form.items.map((item, idx) => {
                            const query = medicineQueries[idx] || "";
                            const filteredMedicines = getFilteredMedicines(query);

                            return (
                                <div key={idx} className="flex gap-2 items-end">

                                    {/* Medicine Combobox */}
                                    <div className="flex-1">
                                        {unqNameloading ? (
                                            <div className="h-10 bg-muted animate-pulse rounded-md" />
                                        ) : (
                                            <Combobox
                                                value={item.medicineName}
                                                onValueChange={(val) => {
                                                    updateItem(idx, "medicineName", val || "");

                                                    // 🔥 set selected value to input
                                                    setMedicineQueries((prev) => ({
                                                        ...prev,
                                                        [idx]: val || "",
                                                    }));
                                                }}
                                            >
                                                <ComboboxInput
                                                    placeholder="Search medicine"
                                                    value={query}
                                                    onChange={(e) =>
                                                        setMedicineQueries((prev) => ({
                                                            ...prev,
                                                            [idx]: e.target.value,
                                                        }))
                                                    }
                                                />

                                                <ComboboxContent>
                                                    <ComboboxList>
                                                        {filteredMedicines.length > 0 ? (
                                                            filteredMedicines.map((m) => (
                                                                <ComboboxItem key={m} value={m}>
                                                                    {m}
                                                                </ComboboxItem>
                                                            ))
                                                        ) : (
                                                            <ComboboxEmpty>
                                                                No medicine found
                                                            </ComboboxEmpty>
                                                        )}
                                                    </ComboboxList>
                                                </ComboboxContent>
                                            </Combobox>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    <div className="w-24">
                                        <Input
                                            type="number"
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

                                    {/* Remove */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeItem(idx)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}

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

            {/* ACTION */}
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
                        variant="outline"
                        onClick={resetForm}
                    >
                        Reset
                    </Button>
                )}
            </div>
        </div >
    );
}