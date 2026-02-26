"use client";

import { useEffect, useState } from "react";
import { useWarehouseStore } from "@/store/warehouse.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
    warehouseId?: string;
    onSuccess?: () => void;
}

export default function WarehouseForm({ warehouseId, onSuccess }: Props) {
    const { form, setForm, createWarehouse, updateWarehouse, resetForm, loading, error } =
        useWarehouseStore();

    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        setMessage(null);
        setErrorMsg(null);

        const success = warehouseId
            ? await updateWarehouse(warehouseId)
            : await createWarehouse();

        if (success) {
            setMessage(warehouseId ? "Warehouse updated successfully." : "Warehouse created successfully.");
            if (!warehouseId) resetForm();
            if (onSuccess) {
                setTimeout(onSuccess, 1500);
            }
        } else {
            setErrorMsg(error || "Something went wrong.");
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            {message && (
                <div className="p-3 rounded-lg bg-green-100 text-green-700 text-sm">
                    {message}
                </div>
            )}
            {errorMsg && (
                <div className="p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                    {errorMsg}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Warehouse Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Warehouse Name"
                        value={form.name}
                        onChange={(e) => setForm({ name: e.target.value })}
                    />
                    <Input
                        placeholder="Location"
                        value={form.location}
                        onChange={(e) => setForm({ location: e.target.value })}
                    />
                    <Input
                        type="number"
                        placeholder="Capacity"
                        value={form.capacity}
                        onChange={(e) => setForm({ capacity: parseInt(e.target.value) || 0 })}
                    />
                    <Input
                        placeholder="Branch Name"
                        value={form.branchName}
                        onChange={(e) => setForm({ branchName: e.target.value })}
                    />
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isActive"
                            checked={form.isActive}
                            onCheckedChange={(checked) => setForm({ isActive: checked })}
                        />
                        <Label htmlFor="isActive">Active</Label>
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
                        : warehouseId
                            ? "Update Warehouse"
                            : "Create Warehouse"}
                </Button>
                {!warehouseId && (
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