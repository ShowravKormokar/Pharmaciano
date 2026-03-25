"use client";

import { useEffect, useState } from "react";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { useOrganizationStore } from "@/store/organization.store";
import { useBranchStore } from "@/store/branch.store";
import { useMedicineStore } from "@/store/medicine.store";
import { useWarehouseStore } from "@/store/warehouse.store";
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

interface Props {
    batchId?: string;
    onSuccess?: () => void;
}

export default function InventoryBatchForm({ batchId, onSuccess }: Props) {
    const { form, setForm, createBatch, updateBatch, resetForm } = useInventoryBatchStore();
    const { organizations, fetchOrganizations } = useOrganizationStore();
    const { branches, fetchBranches } = useBranchStore();
    const { medicines, fetchMedicines } = useMedicineStore();
    const { warehouses, fetchWarehouses } = useWarehouseStore();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchOrganizations();
        fetchBranches();
        fetchMedicines();
        fetchWarehouses();
    }, [fetchOrganizations, fetchBranches, fetchMedicines, fetchWarehouses]);

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
                <CardHeader>
                    <CardTitle>Inventory Batch Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Organization</Label>
                        <Select value={form.orgName} onValueChange={(val) => setForm({ orgName: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select organization" />
                            </SelectTrigger>
                            <SelectContent>
                                {organizations.map((org) => (
                                    <SelectItem key={org._id} value={org.name}>{org.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Branch</Label>
                        <Select value={form.branchName} onValueChange={(val) => setForm({ branchName: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((branch) => (
                                    <SelectItem key={branch._id} value={branch.name}>{branch.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Medicine</Label>
                        <Select value={form.medicineName} onValueChange={(val) => setForm({ medicineName: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select medicine" />
                            </SelectTrigger>
                            <SelectContent>
                                {medicines.map((med) => (
                                    <SelectItem key={med._id} value={med.name}>{med.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Warehouse</Label>
                        <Select value={form.warehouseName} onValueChange={(val) => setForm({ warehouseName: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map((wh) => (
                                    <SelectItem key={wh._id} value={wh.name}>{wh.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Batch Number"
                            value={form.batchNo}
                            onChange={(e) => setForm({ batchNo: e.target.value })}
                        />
                        <Input
                            type="date"
                            placeholder="Expiry Date"
                            value={form.expiryDate}
                            onChange={(e) => setForm({ expiryDate: e.target.value })}
                        />
                        <Input
                            type="number"
                            placeholder="Quantity"
                            value={form.quantity}
                            onChange={(e) => setForm({ quantity: parseInt(e.target.value) || 0 })}
                        />
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Purchase Price"
                            value={form.purchasePrice}
                            onChange={(e) => setForm({ purchasePrice: parseFloat(e.target.value) || 0 })}
                        />
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select value={form.status} onValueChange={(val) => setForm({ status: val })}>
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
        </div>
    );
}