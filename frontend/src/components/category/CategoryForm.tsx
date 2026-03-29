"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/category.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface Props {
    categoryId?: string;
    onSuccess?: () => void;
}

export default function CategoryForm({ categoryId, onSuccess }: Props) {
    const { form, setForm, createCategory, updateCategory, resetForm, loading } = useCategoryStore();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        const success = categoryId ? await updateCategory(categoryId) : await createCategory();
        if (success && onSuccess) {
            setTimeout(onSuccess, 1500);
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Category Information</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">

                    {/* Name */}
                    <div>
                        <Label className="pb-1 pl-1">
                            Category Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Enter category name"
                            value={form.name}
                            onChange={(e) => setForm({ name: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label className="pb-1 pl-1">Description</Label>
                        <Textarea
                            placeholder="Write short description..."
                            value={form.description}
                            onChange={(e) => setForm({ description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between border rounded-lg p-3">
                        <Label className="pb-1 pl-1" htmlFor="isActive">Active Status</Label>
                        <Switch
                            id="isActive"
                            checked={form.isActive}
                            onCheckedChange={(checked) => setForm({ isActive: checked })}
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <Info className="h-4 w-4" />
                        <span>Organization, branch, and warehouse are automatically assigned based on your session.</span>
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
                        : categoryId
                            ? "Update Category"
                            : "Create Category"}
                </Button>
                {!categoryId && (
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