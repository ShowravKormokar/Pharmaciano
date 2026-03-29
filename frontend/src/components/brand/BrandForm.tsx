"use client";

import { useState } from "react";
import { useBrandStore } from "@/store/brand.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface Props {
    brandId?: string;
    onSuccess?: () => void;
}

export default function BrandForm({ brandId, onSuccess }: Props) {
    const { form, setForm, createBrand, updateBrand, resetForm } = useBrandStore();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        const success = brandId
            ? await updateBrand(brandId)
            : await createBrand();

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
                    <div className="space-y-4">

                        <div className="grid gap-4">

                            {/* Brand Name */}
                            <div>
                                <Label className="pl-1 pb-1">
                                    Brand Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    placeholder="Enter brand name"
                                    value={form.name}
                                    onChange={(e) => setForm({ name: e.target.value })}
                                />
                            </div>

                            {/* Manufacturer */}
                            <div>
                                <Label className="pl-1 pb-1">
                                    Manufacturer <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    placeholder="e.g. ACI Limited"
                                    value={form.manufacturer}
                                    onChange={(e) => setForm({ manufacturer: e.target.value })}
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <Label className="pl-1 pb-1">
                                    Country <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    placeholder="e.g. Bangladesh"
                                    value={form.country}
                                    onChange={(e) => setForm({ country: e.target.value })}
                                />
                            </div>

                        </div>
                    </div>

                    {/* Status */}
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

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <Info className="h-4 w-4" />
                        <span>Organization, branch, and warehouse are automatically assigned based on your session.</span>
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
                        : brandId
                            ? "Update Brand"
                            : "Create Brand"}
                </Button>

                {!brandId && (
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