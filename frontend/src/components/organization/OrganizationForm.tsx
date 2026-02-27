"use client";

import { useState } from "react";
import { useOrganizationStore } from "@/store/organization.store";
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
    organizationId?: string;
    onSuccess?: () => void;
}

export default function OrganizationForm({ organizationId, onSuccess }: Props) {
    const { form, setForm, createOrganization, updateOrganization, resetForm, error } = useOrganizationStore();
    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        setMessage(null);
        setErrorMsg(null);

        const success = organizationId
            ? await updateOrganization(organizationId)
            : await createOrganization();

        if (success) {
            setMessage(organizationId ? "Organization updated successfully." : "Organization created successfully.");
            if (!organizationId) resetForm();
            if (onSuccess) {
                setTimeout(onSuccess, 1500);
            }
        } else {
            setErrorMsg(error || "Something went wrong.");
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            {message && (
                <div className="p-3 rounded-lg bg-green-100 text-green-700 text-sm">
                    {message}
                </div>
            )}
            {errorMsg && (
                <div className="p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                    {errorMsg}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Organization Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Organization Name *"
                        value={form.name}
                        onChange={(e) => setForm({ name: e.target.value })}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Trade License No"
                            value={form.tradeLicenseNo}
                            onChange={(e) => setForm({ tradeLicenseNo: e.target.value })}
                        />
                        <Input
                            placeholder="Drug License No"
                            value={form.drugLicenseNo}
                            onChange={(e) => setForm({ drugLicenseNo: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="VAT Registration No"
                            value={form.vatRegistrationNo}
                            onChange={(e) => setForm({ vatRegistrationNo: e.target.value })}
                        />
                        <Input
                            placeholder="Address"
                            value={form.address}
                            onChange={(e) => setForm({ address: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Contact Phone *"
                            value={form.contactPhone}
                            onChange={(e) => setForm({ contactPhone: e.target.value })}
                        />
                        <Input
                            placeholder="Contact Email *"
                            type="email"
                            value={form.contactEmail}
                            onChange={(e) => setForm({ contactEmail: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Subscription Plan *</Label>
                            <Select
                                value={form.subscriptionPlan}
                                onValueChange={(val) => setForm({ subscriptionPlan: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FREE">FREE</SelectItem>
                                    <SelectItem value="BASIC">BASIC</SelectItem>
                                    <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                            <Switch
                                id="isActive"
                                checked={form.isActive}
                                onCheckedChange={(checked) => setForm({ isActive: checked })}
                            />
                            <Label htmlFor="isActive">Active</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button className="w-1/2" onClick={handleSubmit} disabled={submitting}>
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