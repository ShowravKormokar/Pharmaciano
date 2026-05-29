"use client";

import { useEffect, useState } from "react";
import { useAccountStore } from "@/store/account.store";
import { useUniqueNamesStore } from "@/store/uniqueNames.store";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";
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
import { Info } from "lucide-react";

interface Props {
    accountId?: string;
    onSuccess?: () => void;
}

export default function AccountForm({ accountId, onSuccess }: Props) {
    const { form, setForm, createAccount, updateAccount, resetForm } = useAccountStore();
    const { getOrganizationNames, fetchUniqueNames, data, unqNameloading } = useUniqueNamesStore();
    const { user } = useAuthStore();
    const isSuper = isSuperAdmin(user?.email);
    const [submitting, setSubmitting] = useState(false);

    const organizationNames = getOrganizationNames();

    useEffect(() => {
        if (isSuper && !data && !unqNameloading) {
            fetchUniqueNames();
        }
    }, [isSuper, data, unqNameloading, fetchUniqueNames]);

    const handleSubmit = async () => {
        setSubmitting(true);
        const success = accountId ? await updateAccount(accountId) : await createAccount();
        if (success && onSuccess) {
            setTimeout(onSuccess, 1500);
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isSuper && (
                        <div className="space-y-2">
                            <Label>Organization <span className="text-red-500">*</span></Label>
                            {unqNameloading ? (
                                <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
                            ) : (
                                <Select
                                    value={form.organizationName}
                                    onValueChange={(val) => setForm({ organizationName: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizationNames.map((name) => (
                                            <SelectItem key={name} value={name}>
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Account Name <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="e.g., Cash, Accounts Receivable"
                            value={form.name}
                            onChange={(e) => setForm({ name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Account Type <span className="text-red-500">*</span></Label>
                        <Select
                            value={form.type}
                            onValueChange={(val) => setForm({ type: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asset">Asset</SelectItem>
                                <SelectItem value="liability">Liability</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="equity">Equity</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Account Code <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="e.g., 101, 2001"
                            value={form.code}
                            onChange={(e) => setForm({ code: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isActive"
                            checked={form.isActive}
                            onCheckedChange={(checked) => setForm({ isActive: checked })}
                        />
                        <Label htmlFor="isActive">Active</Label>
                    </div>

                    {!isSuper && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <Info className="h-4 w-4" />
                            <span>Organization is automatically assigned based on your session.</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button className="w-1/2" onClick={handleSubmit} disabled={submitting}>
                    {submitting
                        ? "Processing..."
                        : accountId
                            ? "Update Account"
                            : "Create Account"}
                </Button>
                {!accountId && (
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