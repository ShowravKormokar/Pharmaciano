"use client";

import { useEffect, useState } from "react";
import { useBranchStore } from "@/store/branch.store";
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
    branchId?: string;
    onSuccess?: () => void;
}

export default function BranchForm({ branchId, onSuccess }: Props) {
    const { form, setForm, createBranch, updateBranch, resetForm, loading } = useBranchStore();
    const { organizations, fetchOrganizations } = useOrganizationStore();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchOrganizations();
    }, [fetchOrganizations]);

    const handleSubmit = async () => {
        setSubmitting(true);
        const success = branchId ? await updateBranch(branchId) : await createBranch();
        if (success && onSuccess) {
            setTimeout(onSuccess, 1500);
        }
        setSubmitting(false);
    };

    const handleContactChange = (field: "phone" | "email", value: string) => {
        setForm({ contact: { ...form.contact, [field]: value } });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="space-y-4">

                    {/* Branch Name */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Branch Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Enter branch name"
                            value={form.name}
                            onChange={(e) => setForm({ name: e.target.value })}
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Address <span className="text-red-500">*</span>
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
                                Phone <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="Enter phone number"
                                value={form.contact.phone}
                                onChange={(e) =>
                                    handleContactChange("phone", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label className="text-primary pb-1 pl-1">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="email"
                                placeholder="Enter email"
                                value={form.contact.email}
                                onChange={(e) =>
                                    handleContactChange("email", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Organization */}
                    <div>
                        <Label className="text-primary pb-1 pl-1">
                            Organization <span className="text-red-500">*</span>
                        </Label>
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

                    {/* Active Switch */}
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