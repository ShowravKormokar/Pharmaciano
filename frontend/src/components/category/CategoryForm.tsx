"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/category.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Category Name"
                        value={form.name}
                        onChange={(e) => setForm({ name: e.target.value })}
                    />
                    <Textarea
                        placeholder="Description (optional)"
                        value={form.description}
                        onChange={(e) => setForm({ description: e.target.value })}
                        rows={3}
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