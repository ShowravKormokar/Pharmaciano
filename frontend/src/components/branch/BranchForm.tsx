"use client";

import { useEffect, useState } from "react";
import { useBranchStore } from "@/store/branch.store";
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
    branchId?: string;
    onSuccess?: () => void;
}

export default function BranchForm({ branchId, onSuccess }: Props) {
    const { form, setForm, createBranch, updateBranch, resetForm, loading, error } = useBranchStore();
    const { organizations, fetchOrganizations } = useOrganizationStore();

    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchOrganizations();
    }, [fetchOrganizations]);

    const handleSubmit = async () => {
        setSubmitting(true);
        setMessage(null);
        setErrorMsg(null);

        const success = branchId ? await updateBranch(branchId) : await createBranch();

        if (success) {
            setMessage(branchId ? "Branch updated successfully." : "Branch created successfully.");
            if (!branchId) resetForm();
            if (onSuccess) {
                setTimeout(onSuccess, 1500);
            }
        } else {
            setErrorMsg(error || "Something went wrong.");
        }
        setSubmitting(false);
    };

    const handleContactChange = (field: "phone" | "email", value: string) => {
        setForm({ contact: { ...form.contact, [field]: value } });
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
                    <CardTitle>Branch Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Branch Name"
                        value={form.name}
                        onChange={(e) => setForm({ name: e.target.value })}
                    />
                    <Input
                        placeholder="Address"
                        value={form.address}
                        onChange={(e) => setForm({ address: e.target.value })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Phone"
                            value={form.contact.phone}
                            onChange={(e) => handleContactChange("phone", e.target.value)}
                        />
                        <Input
                            placeholder="Email"
                            type="email"
                            value={form.contact.email}
                            onChange={(e) => handleContactChange("email", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Organization</Label>
                        <Select
                            value={form.orgName}
                            onValueChange={(val) => setForm({ orgName: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select organization" />
                            </SelectTrigger>
                            <SelectContent>
                                {organizations.map((org) => (
                                    <SelectItem key={org._id} value={org.name}>
                                        {org.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                        : branchId
                            ? "Update Branch"
                            : "Create Branch"}
                </Button>
                {!branchId && (
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