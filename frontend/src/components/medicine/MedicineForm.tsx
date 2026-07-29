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
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import { Info } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";
import { useUniqueNamesStore } from "@/store/uniqueNames.store";

// Pre‑defined options for combobox fields
const DOSAGE_FORM_OPTIONS = [
    "Tablet",
    "Capsule",
    "Syrup",
    "Suspension",
    "Drops",
    "Inhaler",
    "Injection",
    "Ointment",
    "Cream",
    "Gel",
    "Patch",
    "Suppository",
    "Spray",
    "Powder",
    "Solution",
];

const STRENGTH_OPTIONS = [
    "1",
    "2",
    "2.5",
    "5",
    "7.5",
    "10",
    "15",
    "20",
    "25",
    "30",
    "40",
    "50",
    "75",
    "100",
    "150",
    "200",
    "250",
    "300",
    "400",
    "500",
    "600",
    "750",
    "800",
    "1000",
    "1200",
];

const UNIT_OPTIONS = [
    "mg",
    "mcg",
    "g",
    "kg",
    "ml",
    "L",
    "IU",
    "%",
    "mEq",
];

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
    const [dosageQuery, setDosageQuery] = useState(form.dosageForm || "");
    const [strengthQuery, setStrengthQuery] = useState(form.strength || "");
    const [unitQuery, setUnitQuery] = useState(form.unit || "");

    const organizationNames = getOrganizationNames() as Array<string | { _id: string; name: string }>;

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
                                <SelectTrigger id="category" className="w-full">
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
                                <SelectTrigger id="brand" className="w-full">
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

                    {/* Dosage – Combobox fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Dosage Form */}
                        <div className="space-y-2">
                            <Label htmlFor="dosageForm">Dosage Form<span className="text-red-500">*</span></Label>
                            <Combobox
                                value={form.dosageForm}
                                onValueChange={(val) => {
                                    setForm({ dosageForm: val || "" });
                                    setDosageQuery(val || "");
                                }}
                            >
                                <ComboboxInput
                                    id="dosageForm"
                                    placeholder="Type or select..."
                                    value={dosageQuery}
                                    onChange={(e) => {
                                        setDosageQuery(e.target.value);
                                        setForm({ dosageForm: e.target.value });
                                    }}
                                />
                                <ComboboxContent>
                                    <ComboboxList>
                                        {DOSAGE_FORM_OPTIONS.filter(opt =>
                                            opt.toLowerCase().includes(dosageQuery.toLowerCase())
                                        ).map((opt) => (
                                            <ComboboxItem key={opt} value={opt}>
                                                {opt}
                                            </ComboboxItem>
                                        ))}
                                        {DOSAGE_FORM_OPTIONS.filter(opt =>
                                            opt.toLowerCase().includes(dosageQuery.toLowerCase())
                                        ).length === 0 && (
                                                <ComboboxEmpty>No option found</ComboboxEmpty>
                                            )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>

                        {/* Strength */}
                        <div className="space-y-2">
                            <Label htmlFor="strength">Strength<span className="text-red-500">*</span></Label>
                            <Combobox
                                value={form.strength}
                                onValueChange={(val) => {
                                    setForm({ strength: val || "" });
                                    setStrengthQuery(val || "");
                                }}
                            >
                                <ComboboxInput
                                    id="strength"
                                    placeholder="Type or select..."
                                    value={strengthQuery}
                                    onChange={(e) => {
                                        setStrengthQuery(e.target.value);
                                        setForm({ strength: e.target.value });
                                    }}
                                />
                                <ComboboxContent>
                                    <ComboboxList>
                                        {STRENGTH_OPTIONS.filter(opt =>
                                            opt.toLowerCase().includes(strengthQuery.toLowerCase())
                                        ).map((opt) => (
                                            <ComboboxItem key={opt} value={opt}>
                                                {opt}
                                            </ComboboxItem>
                                        ))}
                                        {STRENGTH_OPTIONS.filter(opt =>
                                            opt.toLowerCase().includes(strengthQuery.toLowerCase())
                                        ).length === 0 && (
                                                <ComboboxEmpty>No option found</ComboboxEmpty>
                                            )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>

                        {/* Unit */}
                        <div className="space-y-2">
                            <Label htmlFor="unit">Unit<span className="text-red-500">*</span></Label>
                            <Combobox
                                value={form.unit}
                                onValueChange={(val) => {
                                    setForm({ unit: val || "" });
                                    setUnitQuery(val || "");
                                }}
                            >
                                <ComboboxInput
                                    id="unit"
                                    placeholder="Type or select..."
                                    value={unitQuery}
                                    onChange={(e) => {
                                        setUnitQuery(e.target.value);
                                        setForm({ unit: e.target.value });
                                    }}
                                />
                                <ComboboxContent>
                                    <ComboboxList>
                                        {UNIT_OPTIONS.filter(opt =>
                                            opt.toLowerCase().includes(unitQuery.toLowerCase())
                                        ).map((opt) => (
                                            <ComboboxItem key={opt} value={opt}>
                                                {opt}
                                            </ComboboxItem>
                                        ))}
                                        {UNIT_OPTIONS.filter(opt =>
                                            opt.toLowerCase().includes(unitQuery.toLowerCase())
                                        ).length === 0 && (
                                                <ComboboxEmpty>No option found</ComboboxEmpty>
                                            )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
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
                                        {organizationNames.map((item) => {
                                            const name = typeof item === 'string' ? item : item.name;
                                            const id = typeof item === 'string' ? item : item._id;
                                            return (
                                                <SelectItem key={id} value={name}>
                                                    {name}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}

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