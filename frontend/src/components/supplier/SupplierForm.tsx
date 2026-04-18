"use client";

import { useState } from "react";
import { useSupplierStore } from "@/store/supplier.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
    supplierId?: string;
    onSuccess?: () => void;
}

export default function SupplierForm({ supplierId, onSuccess }: Props) {
    const { form, setForm, createSupplier, updateSupplier, resetForm } = useSupplierStore();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        const success = supplierId ? await updateSupplier(supplierId) : await createSupplier();
        if (success && onSuccess) {
            setTimeout(onSuccess, 1500);
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <Card>

                <CardContent className="space-y-4">

                    {/* Supplier Name */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Supplier Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Enter supplier name"
                            value={form.name}
                            onChange={(e) => setForm({ name: e.target.value })}
                        />
                    </div>

                    {/* Contact Person */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Contact Person
                        </Label>
                        <Input
                            placeholder="Enter contact person name"
                            value={form.contactPerson}
                            onChange={(e) =>
                                setForm({ contactPerson: e.target.value })
                            }
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Phone
                        </Label>
                        <Input
                            placeholder="Enter phone number"
                            value={form.phone}
                            onChange={(e) => setForm({ phone: e.target.value })}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Email
                        </Label>
                        <Input
                            type="email"
                            placeholder="Enter email address"
                            value={form.email}
                            onChange={(e) => setForm({ email: e.target.value })}
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Address
                        </Label>
                        <Textarea
                            placeholder="Enter supplier address"
                            value={form.address}
                            onChange={(e) =>
                                setForm({ address: e.target.value })
                            }
                            rows={3}
                        />
                    </div>

                    {/* Active */}
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
                        : supplierId
                            ? "Update Supplier"
                            : "Create Supplier"}
                </Button>

                {!supplierId && (
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