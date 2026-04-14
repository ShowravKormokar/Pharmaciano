"use client";

import { useEffect, useMemo, useState } from "react";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { useOrganizationStore } from "@/store/organization.store";
import { useBranchStore } from "@/store/branch.store";
import { useMedicineStore } from "@/store/medicine.store";
import { useWarehouseStore } from "@/store/warehouse.store";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";
import { useUniqueNamesStore } from "@/store/uniqueNames.store";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox";

interface Props {
    batchId?: string;
    onSuccess?: () => void;
}

export default function InventoryBatchForm({ batchId, onSuccess }: Props) {
    const { form, setForm, createBatch, updateBatch, resetForm } = useInventoryBatchStore();
    const { user, isAuthenticated, loading } = useAuthStore();
    const isSuper = isSuperAdmin(user?.email);
    const { organizations, fetchOrganizations } = useOrganizationStore();
    const { branches, fetchBranches } = useBranchStore();
    const { warehouses, fetchWarehouses } = useWarehouseStore();
    const [submitting, setSubmitting] = useState(false);
    const [query, setQuery] = useState("");
    const {
        unqNameloading,
        getMedicineNames
    } = useUniqueNamesStore();

    useEffect(() => {
        if (isSuper) {
            Promise.all([
                fetchOrganizations(),
                fetchBranches(),
                fetchWarehouses()
            ]);
        } else {
            fetchWarehouses();
        }
    }, [isSuper, fetchOrganizations, fetchBranches, fetchWarehouses]);

    const medicineNames = getMedicineNames();

    const filteredBranches = useMemo(() => {
        if (!isSuper) return [];

        if (!form.orgName) return branches;

        return branches.filter(
            (b) => b.organizationId?.name?.toLowerCase() === form.orgName?.toLowerCase()
        );
    }, [branches, form.orgName, isSuper]);

    const filteredWarehouses = useMemo(() => {
        if (!isSuper && user) {
            return warehouses.filter(
                (w) =>
                    w.branchId?.name === user.branchId?.name &&
                    w.organizationId === user.organizationId?.name
            );
        }

        if (form.branchName) {
            return warehouses.filter(
                (w) => w.branchId?.name === form.branchName
            );
        }

        return warehouses;
    }, [warehouses, form.branchName, isSuper, user]);

    const filteredMedicines = useMemo(() => {
        if (!query) return medicineNames;

        return medicineNames.filter((name) =>
            name.toLowerCase().includes(query.toLowerCase())
        );
    }, [medicineNames, query]);

    const handleOrgChange = (val: string) => {
        setForm({ orgName: val, branchName: "", warehouseName: "" });
    };

    const handleBranchChange = (val: string) => {
        setForm({ branchName: val, warehouseName: "" });
    };


    const handleSubmit = async () => {
        setSubmitting(true);
        const success = batchId ? await updateBatch(batchId) : await createBatch();
        if (success && onSuccess) {
            setTimeout(onSuccess, 1500);
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="space-y-6">

                    {/* Organization Info */}
                    {isSuper && (
                        loading ? (
                            <div className="space-y-3">
                                <div className="h-10 bg-muted rounded-md animate-pulse" />
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-primary">
                                        Organization Details
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Organization Select */}
                                        <div>
                                            <Label className="pb-1 pl-1">
                                                Organization <span className="text-red-500">*</span>
                                            </Label>
                                            {/* <Select
                                            value={form.orgName}
                                            onValueChange={(val) => setForm({ orgName: val })}
                                            > */}
                                            <Select
                                                value={form.orgName}
                                                onValueChange={handleOrgChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select organization" />
                                                </SelectTrigger>
                                                <SelectContent className="capitalize">
                                                    {organizations.map((org) => (
                                                        <SelectItem key={org._id} value={org.name}>
                                                            {org.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Branch Select */}
                                        <div>
                                            <Label className="pb-1 pl-1">
                                                Branch <span className="text-red-500">*</span>
                                            </Label>
                                            {/* <Select
                                                value={form.branchName}
                                                onValueChange={(val) => setForm({ branchName: val })}
                                                >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select branch" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {branches.map((branch) => (
                                                    <SelectItem key={branch._id} value={branch.name}>
                                                        {branch.name}
                                                    </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select> */}
                                            <Select value={form.branchName} onValueChange={handleBranchChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select branch" />
                                                </SelectTrigger>
                                                <SelectContent className="capitalize">
                                                    {filteredBranches.map((branch) => (
                                                        <SelectItem key={branch._id} value={branch.name}>
                                                            {branch.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <Separator />
                            </>
                        )
                    )}


                    {/* Medicine */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-primary">
                            Medicine & Storage
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="pb-1 pl-1">Medicine <span className="text-red-500">*</span></Label>
                                {
                                    unqNameloading ? (
                                        <div className="h-10 bg-muted rounded-md animate-pulse" />
                                    ) : (
                                        <Combobox
                                            value={form.medicineName || undefined}
                                            onValueChange={(val) => {
                                                setForm({ medicineName: val || "" });
                                                setQuery(""); // optional: reset search after select
                                            }}
                                        >
                                            <ComboboxInput
                                                placeholder="Select medicine"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                            />

                                            <ComboboxContent>
                                                <ComboboxList>
                                                    {filteredMedicines.map((name) => (
                                                        <ComboboxItem key={name} value={name}>
                                                            {name}
                                                        </ComboboxItem>
                                                    ))}

                                                    {filteredMedicines.length === 0 && (
                                                        <ComboboxEmpty>No medicine found.</ComboboxEmpty>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                    )
                                }
                                {/* <Select
                                    value={form.medicineName}
                                    onValueChange={(val) => setForm({ medicineName: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select medicine" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {medicines.map((med) => (
                                            <SelectItem key={med._id} value={med.name} className="capitalize">
                                                {med.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select> */}
                            </div>
                            {/* Warehouse Select */}
                            <div>
                                <Label className="pb-1 pl-1">
                                    Warehouse <span className="text-red-500">*</span>
                                </Label>
                                {/* <Select
                                                value={form.warehouseName}
                                                onValueChange={(val) => setForm({ warehouseName: val })}
                                                >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select warehouse" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {warehouses.map((wh) => (
                                                    <SelectItem key={wh._id} value={wh.name} className="capitalize">
                                                        {wh.name}
                                                    </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select> */}
                                <Select
                                    value={form.warehouseName}
                                    onValueChange={(val) => setForm({ warehouseName: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select warehouse" />
                                    </SelectTrigger>
                                    <SelectContent className="capitalize">
                                        {filteredWarehouses.map((wh) => (
                                            <SelectItem key={wh._id} value={wh.name}>
                                                {wh.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Batch Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-primary">
                            Batch Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="pb-1 pl-1">Batch Number <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="e.g. NAPA-BATCH-2026-01"
                                    value={form.batchNo}
                                    onChange={(e) => setForm({ batchNo: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label className="pb-1 pl-1">Expiry Date <span className="text-red-500">*</span></Label>
                                <Input
                                    type="date"
                                    value={form.expiryDate}
                                    onChange={(e) => setForm({ expiryDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label className="pb-1 pl-1">Quantity <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number"
                                    placeholder="Whole number (e.g. 10, 25)"
                                    value={form.quantity}
                                    onChange={(e) =>
                                        setForm({ quantity: parseInt(e.target.value) || 0 })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pb-1 pl-1">Purchase Price (Tk) <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 3.50"
                                    value={form.purchasePrice}
                                    onChange={(e) =>
                                        setForm({
                                            purchasePrice: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label className="pb-1 pl-1">Status</Label>
                        <Select
                            value={form.status}
                            onValueChange={(val) => setForm({ status: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="low_stock">Low Stock</SelectItem>
                            </SelectContent>
                        </Select>
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
                        : batchId
                            ? "Update Batch"
                            : "Create Batch"}
                </Button>

                {!batchId && (
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
        </div >
    );
}