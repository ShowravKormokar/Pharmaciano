"use client";

import { useEffect, useState } from "react";
import { useMedicineStore } from "@/store/medicine.store";
import { useCategoryStore } from "@/store/category.store";
import { useBrandStore } from "@/store/brand.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    medicineId?: string;
    onSuccess?: () => void;
}

export default function MedicineForm({ medicineId, onSuccess }: Props) {
    const { form, setForm, createMedicine, updateMedicine, resetForm } = useMedicineStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { brands, fetchBrands } = useBrandStore();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, [fetchCategories, fetchBrands]);

    const handleSubmit = async () => {
        setSubmitting(true);
        const success = medicineId ? await updateMedicine(medicineId) : await createMedicine();
        if (success && onSuccess) {
            setTimeout(onSuccess, 1500);
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid gap-4">
                        <div>
                            <Label className="pb-1 pl-1">Medicine Name <span className="text-red-500">*</span></Label>
                            <Input
                                placeholder="Enter medicine name"
                                value={form.name}
                                onChange={(e) => setForm({ name: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label className="pb-1 pl-1">Generic Name</Label>
                            <Input
                                placeholder="Enter generic name"
                                value={form.genericName}
                                onChange={(e) => setForm({ genericName: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Category + Brand */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="pb-1 pl-1">Category <span className="text-red-500">*</span></Label>
                            <Select
                                value={form.categoryName}
                                onValueChange={(val) => setForm({ categoryName: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat._id} value={cat.name} className="capitalize">
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="pb-1 pl-1">Brand <span className="text-red-500">*</span></Label>
                            <Select
                                value={form.brandName}
                                onValueChange={(val) => setForm({ brandName: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand._id} value={brand.name} className="capitalize">
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Dosage */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="pb-1 pl-1">Dosage Form</Label>
                            <Input
                                placeholder="Tablet / Syrup / Capsule"
                                value={form.dosageForm}
                                onChange={(e) => setForm({ dosageForm: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-2">
                            <div className="w-full">
                                <Label className="pb-1 pl-1">Strength</Label>
                                <Input
                                    placeholder="e.g. 500"
                                    value={form.strength}
                                    onChange={(e) => setForm({ strength: e.target.value })}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="pb-1 pl-1">Unit</Label>
                                <Input
                                    placeholder="mg / ml"
                                    value={form.unit}
                                    onChange={(e) => setForm({ unit: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="pb-1 pl-1">Unit Price (Tk) <span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="Enter price"
                                value={form.unitPrice}
                                onChange={(e) =>
                                    setForm({ unitPrice: parseFloat(e.target.value) || 0 })
                                }
                            />
                        </div>

                        <div>
                            <Label className="pb-1 pl-1">Units per Strip</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 10"
                                value={form.unitsPerStrip}
                                onChange={(e) =>
                                    setForm({ unitsPerStrip: parseInt(e.target.value) || 0 })
                                }
                            />
                        </div>
                    </div>

                    {/* Tax + Switches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="pb-1 pl-1">Tax Rate (%)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="e.g. 5"
                                value={form.taxRate}
                                onChange={(e) =>
                                    setForm({ taxRate: parseFloat(e.target.value) || 0 })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between border rounded-lg p-3">
                            <Label htmlFor="prescription">Prescription Required</Label>
                            <Switch
                                id="prescription"
                                checked={form.isPrescriptionRequired}
                                onCheckedChange={(checked) =>
                                    setForm({ isPrescriptionRequired: checked })
                                }
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between border rounded-lg p-3">
                        <Label htmlFor="isActive">Active Status</Label>
                        <Switch
                            id="isActive"
                            checked={form.isActive}
                            onCheckedChange={(checked) =>
                                setForm({ isActive: checked })
                            }
                        />
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
                        : medicineId
                            ? "Update Medicine"
                            : "Create Medicine"}
                </Button>

                {!medicineId && (
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