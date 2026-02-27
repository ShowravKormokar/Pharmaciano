"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user.store";
import { useRoleStore } from "@/store/role.store";
import { useOrganizationStore } from "@/store/organization.store";
import { useBranchStore } from "@/store/branch.store";
import { useWarehouseStore } from "@/store/warehouse.store";
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
    userId?: string;
    onSuccess?: () => void;
}

export default function UserForm({ userId, onSuccess }: Props) {
    const { form, setForm, createUser, updateUser, resetForm, loading, error } = useUserStore();
    const { roles, fetchRoles } = useRoleStore();
    const { organizations, fetchOrganizations } = useOrganizationStore();
    const { branches, fetchBranches } = useBranchStore();
    const { warehouses, fetchWarehouses } = useWarehouseStore();

    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Fetch dropdown data on mount
    useEffect(() => {
        fetchRoles();
        fetchOrganizations();
        fetchBranches();
        fetchWarehouses();
    }, [fetchRoles, fetchOrganizations, fetchBranches, fetchWarehouses]);

    const handleSubmit = async () => {
        setSubmitting(true);
        setMessage(null);
        setErrorMsg(null);

        const success = userId
            ? await updateUser(userId)
            : await createUser();

        if (success) {
            setMessage(userId ? "User updated successfully." : "User created successfully.");
            if (!userId) resetForm();
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
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => setForm({ name: e.target.value })}
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ email: e.target.value })}
                    />
                    <Input
                        type="password"
                        placeholder={userId ? "Password (leave blank to keep current)" : "Password"}
                        value={form.password}
                        onChange={(e) => setForm({ password: e.target.value })}
                    />
                    <Input
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) => setForm({ phone: e.target.value })}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Role</Label>
                            <Select
                                value={form.role}
                                onValueChange={(val) => setForm({ role: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role._id} value={role.name}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Branch</Label>
                            <Select
                                value={form.branchName}
                                onValueChange={(val) => setForm({ branchName: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map((branch) => (
                                        <SelectItem key={branch._id} value={branch.name}>
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Warehouse (optional)</Label>
                            <Select
                                value={form.warehouseName}
                                onValueChange={(val) => setForm({ warehouseName: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select warehouse" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.map((wh) => (
                                        <SelectItem key={wh._id} value={wh.name}>
                                            {wh.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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
                        : userId
                            ? "Update User"
                            : "Create User"}
                </Button>
                {!userId && (
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
};