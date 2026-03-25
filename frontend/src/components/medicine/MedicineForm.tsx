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
                <CardHeader>
                    <CardTitle>Medicine Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Medicine Name *"
                        value={form.name}
                        onChange={(e) => setForm({ name: e.target.value })}
                    />
                    <Input
                        placeholder="Generic Name"
                        value={form.genericName}
                        onChange={(e) => setForm({ genericName: e.target.value })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Category</Label>
                            <Select
                                value={form.categoryName}
                                onValueChange={(val) => setForm({ categoryName: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat._id} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Brand</Label>
                            <Select
                                value={form.brandName}
                                onValueChange={(val) => setForm({ brandName: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand._id} value={brand.name}>
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Dosage Form"
                            value={form.dosageForm}
                            onChange={(e) => setForm({ dosageForm: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <Input
                                placeholder="Strength"
                                value={form.strength}
                                onChange={(e) => setForm({ strength: e.target.value })}
                            />
                            <Input
                                placeholder="Unit"
                                value={form.unit}
                                onChange={(e) => setForm({ unit: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Unit Price"
                            value={form.unitPrice}
                            onChange={(e) => setForm({ unitPrice: parseFloat(e.target.value) || 0 })}
                        />
                        <Input
                            type="number"
                            placeholder="Units per Strip"
                            value={form.unitsPerStrip}
                            onChange={(e) => setForm({ unitsPerStrip: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Tax Rate (%)"
                            value={form.taxRate}
                            onChange={(e) => setForm({ taxRate: parseFloat(e.target.value) || 0 })}
                        />
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="prescription"
                                checked={form.isPrescriptionRequired}
                                onCheckedChange={(checked) => setForm({ isPrescriptionRequired: checked })}
                            />
                            <Label htmlFor="prescription">Prescription Required</Label>
                        </div>
                    </div>
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