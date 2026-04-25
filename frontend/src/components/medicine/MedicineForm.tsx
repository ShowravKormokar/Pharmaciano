"use client";

import { useEffect, useState } from "react";
import { useMedicineStore } from "@/store/medicine.store";
import { useCategoryStore } from "@/store/category.store";
import { useBrandStore } from "@/store/brand.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";
import { useUniqueNamesStore } from "@/store/uniqueNames.store";

interface Props {
    medicineId?: string;
    onSuccess?: () => void;
}

export default function MedicineForm({ medicineId, onSuccess }: Props) {
    const { form, setForm, createMedicine, updateMedicine, resetForm } = useMedicineStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { brands, fetchBrands } = useBrandStore();
    const { unqNameloading, getOrganizationNames, fetchUniqueNames, data } = useUniqueNamesStore();
    const { user } = useAuthStore();
    const isSuper = isSuperAdmin(user?.email);
    const [submitting, setSubmitting] = useState(false);

    const organizationNames = getOrganizationNames();

    useEffect(() => {
        fetchCategories();
        fetchBrands();
        if (isSuper && !data && !unqNameloading) {
            fetchUniqueNames();
        }
    }, [fetchCategories, fetchBrands, fetchUniqueNames, isSuper, data, unqNameloading]);

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
                        <div className="space-y-2">
                            <Label htmlFor="name">Medicine Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                placeholder="Enter medicine name"
                                value={form.name}
                                onChange={(e) => setForm({ name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="genericName">Generic Name<span className="text-red-500">*</span></Label>
                            <Input
                                id="genericName"
                                placeholder="Enter generic name"
                                value={form.genericName}
                                onChange={(e) => setForm({ genericName: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Category + Brand */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                            <Select
                                value={form.categoryName}
                                onValueChange={(val) => setForm({ categoryName: val })}
                            >
                                <SelectTrigger id="category">
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

                        <div className="space-y-2">
                            <Label htmlFor="brand">Brand <span className="text-red-500">*</span></Label>
                            <Select
                                value={form.brandName}
                                onValueChange={(val) => setForm({ brandName: val })}
                            >
                                <SelectTrigger id="brand">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="dosageForm">Dosage Form<span className="text-red-500">*</span></Label>
                            <Input
                                id="dosageForm"
                                placeholder="e.g., Tablet, Syrup, Capsule"
                                value={form.dosageForm}
                                onChange={(e) => setForm({ dosageForm: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="strength">Strength<span className="text-red-500">*</span></Label>
                                <Input
                                    id="strength"
                                    placeholder="e.g., 500"
                                    value={form.strength}
                                    onChange={(e) => setForm({ strength: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit">Unit<span className="text-red-500">*</span></Label>
                                <Input
                                    id="unit"
                                    placeholder="mg / ml"
                                    value={form.unit}
                                    onChange={(e) => setForm({ unit: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="unitPrice">Unit Price (Tk) <span className="text-red-500">*</span></Label>
                            <Input
                                id="unitPrice"
                                type="number"
                                step="0.01"
                                placeholder="Enter price"
                                value={form.unitPrice}
                                onChange={(e) =>
                                    setForm({ unitPrice: parseFloat(e.target.value) || 0 })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unitsPerStrip">Units per Strip</Label>
                            <Input
                                id="unitsPerStrip"
                                type="number"
                                placeholder="e.g., 10"
                                value={form.unitsPerStrip}
                                onChange={(e) =>
                                    setForm({ unitsPerStrip: parseInt(e.target.value) || 0 })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stripPrice">Strip Price</Label>
                            <Input
                                id="stripPrice"
                                type="number"
                                placeholder="e.g., 10"
                                value={form.stripPrice}
                                onChange={(e) =>
                                    setForm({ stripPrice: parseInt(e.target.value) || 0 })
                                }
                            />
                        </div>
                    </div>

                    {/* Tax + Switches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="taxRate">Tax Rate (%)</Label>
                            <Input
                                id="taxRate"
                                type="number"
                                step="0.01"
                                placeholder="e.g., 5"
                                value={form.taxRate}
                                onChange={(e) =>
                                    setForm({ taxRate: parseFloat(e.target.value) || 0 })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between border rounded-lg p-4">
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

                    <div className="flex items-center justify-between border rounded-lg p-4">
                        <Label htmlFor="isActive">Active Status</Label>
                        <Switch
                            id="isActive"
                            checked={form.isActive}
                            onCheckedChange={(checked) =>
                                setForm({ isActive: checked })
                            }
                        />
                    </div>

                    {/* Organization selection (only for super admin) */}
                    {isSuper && (
                        <div className="space-y-2">
                            <Label htmlFor="organization">Organization <span className="text-red-500">*</span></Label>
                            {unqNameloading ? (
                                <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
                            ) : (
                                <Select
                                    value={form.organizationName}
                                    onValueChange={(val) => setForm({ organizationName: val })}
                                >
                                    <SelectTrigger id="organization">
                                        <SelectValue placeholder="Select organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizationNames.map((name) => (
                                            <SelectItem key={name} value={name}>
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}

                    {/* Existing fields (name, generic name, category, brand, dosage etc.) */}
                    {/* ... rest of your form fields ... */}

                    {/* Note for normal users */}
                    {!isSuper && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <Info className="h-4 w-4" />
                            <span>Organization, branch, and warehouse are automatically assigned based on your session.</span>
                        </div>
                    )}
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