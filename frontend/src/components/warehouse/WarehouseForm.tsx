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

                <CardContent className="space-y-4">

                    {/* Warehouse Name */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Warehouse Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Enter warehouse name"
                            value={form.name}
                            onChange={(e) => setForm({ name: e.target.value })}
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Location <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Enter location"
                            value={form.location}
                            onChange={(e) => setForm({ location: e.target.value })}
                        />
                    </div>

                    {/* Capacity */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Capacity
                        </Label>
                        <Input
                            type="number"
                            placeholder="Enter capacity (optional)"
                            value={form.capacity}
                            onChange={(e) =>
                                setForm({ capacity: parseInt(e.target.value) || 0 })
                            }
                        />
                    </div>

                    {/* Branch Name */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Branch Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Enter branch name"
                            value={form.branchName}
                            onChange={(e) => setForm({ branchName: e.target.value })}
                        />
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isActive"
                            checked={form.isActive}
                            onCheckedChange={(checked) =>
                                setForm({ isActive: checked })
                            }
                        />
                        <Label htmlFor="isActive" className="text-primary">
                            Active
                        </Label>
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