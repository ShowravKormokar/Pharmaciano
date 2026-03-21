"use client";

import { useState } from "react";
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
    const { form, setForm, createWarehouse, updateWarehouse, resetForm } = useWarehouseStore();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        const success = warehouseId ? await updateWarehouse(warehouseId) : await createWarehouse();
        if (success && onSuccess) {
            setTimeout(onSuccess, 1500);
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Warehouse Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Warehouse Name *"
                        value={form.name}
                        onChange={(e) => setForm({ name: e.target.value })}
                    />
                    <Input
                        placeholder="Location *"
                        value={form.location}
                        onChange={(e) => setForm({ location: e.target.value })}
                    />
                    <Input
                        type="number"
                        placeholder="Capacity (optional)"
                        value={form.capacity}
                        onChange={(e) =>
                            setForm({ capacity: parseInt(e.target.value) || 0 })
                        }
                    />
                    <Input
                        placeholder="Branch Name *"
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