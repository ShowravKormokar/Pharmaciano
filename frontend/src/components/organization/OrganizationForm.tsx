"use client";

import { useState } from "react";
import { useOrganizationStore } from "@/store/organization.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    organizationId?: string;
    onSuccess?: () => void;
}

export default function OrganizationForm({ organizationId, onSuccess }: Props) {
    const { form, setForm, createOrganization, updateOrganization, resetForm } = useOrganizationStore();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        const success = organizationId
            ? await updateOrganization(organizationId)
            : await createOrganization();
        if (success && onSuccess) {
            setTimeout(onSuccess, 1500);
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <Card>

                <CardContent className="space-y-4">

                    {/* Organization Name */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Organization Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Enter organization name"
                            value={form.name}
                            onChange={(e) => setForm({ name: e.target.value })}
                        />
                    </div>

                    {/* License Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div>
                            <Label className="text-primary pb-1 pl-1">
                                Trade License No
                            </Label>
                            <Input
                                placeholder="Enter trade license no"
                                value={form.tradeLicenseNo}
                                onChange={(e) =>
                                    setForm({ tradeLicenseNo: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label className="text-primary pb-1 pl-1">
                                Drug License No
                            </Label>
                            <Input
                                placeholder="Enter drug license no"
                                value={form.drugLicenseNo}
                                onChange={(e) =>
                                    setForm({ drugLicenseNo: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label className="text-primary pb-1 pl-1">
                                VAT Registration No
                            </Label>
                            <Input
                                placeholder="Enter VAT registration no"
                                value={form.vatRegistrationNo}
                                onChange={(e) =>
                                    setForm({ vatRegistrationNo: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Address<span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            placeholder="Enter address"
                            value={form.address}
                            onChange={(e) => setForm({ address: e.target.value })}
                            rows={2}
                        />
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <Label className="text-primary pb-1 pl-1">
                                Contact Phone <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="Enter phone number"
                                value={form.contactPhone}
                                onChange={(e) =>
                                    setForm({ contactPhone: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label className="text-primary pb-1 pl-1">
                                Contact Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="email"
                                placeholder="Enter email"
                                value={form.contactEmail}
                                onChange={(e) =>
                                    setForm({ contactEmail: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    {/* Subscription Plan */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Subscription Plan <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={form.subscriptionPlan}
                            onValueChange={(val) =>
                                setForm({ subscriptionPlan: val })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select plan" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="FREE">Free</SelectItem>
                                <SelectItem value="BASIC">Basic</SelectItem>
                                <SelectItem value="PREMIUM">Premium</SelectItem>
                                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                            </SelectContent>
                        </Select>
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
                        : organizationId
                            ? "Update Organization"
                            : "Create Organization"}
                </Button>

                {!organizationId && (
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