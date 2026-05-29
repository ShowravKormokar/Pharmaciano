"use client";

import { useEffect, useState } from "react";
import { useJournalStore } from "@/store/journal.store";
import { useAccountStore } from "@/store/account.store";
import { useUniqueNamesStore } from "@/store/uniqueNames.store";
import { useAuthStore } from "@/store/auth.store";
import { isSuperAdmin } from "@/lib/isSuperAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    journalId?: string;
    onSuccess?: () => void;
}

export default function JournalForm({ journalId, onSuccess }: Props) {
    const { form, setForm, createJournal, resetForm } = useJournalStore();
    const { accounts, fetchAccounts } = useAccountStore();
    const { getOrganizationNames, getBranchNames, fetchUniqueNames, data, unqNameloading } = useUniqueNamesStore();
    const { user } = useAuthStore();
    const isSuper = isSuperAdmin(user?.email);
    const [submitting, setSubmitting] = useState(false);

    const organizationNames = getOrganizationNames();
    const branchNames = getBranchNames();

    useEffect(() => {
        fetchAccounts({ limit: 100 });
        if (isSuper && !data && !unqNameloading) {
            fetchUniqueNames();
        }
    }, [fetchAccounts, isSuper, data, unqNameloading, fetchUniqueNames]);

    const handleSubmit = async () => {
        setSubmitting(true);
        const success = await createJournal();
        if (success && onSuccess) {
            setTimeout(onSuccess, 1500);
        }
        setSubmitting(false);
    };

    // Filter accounts for dropdowns
    const accountOptions = accounts.map(acc => ({ id: acc._id, name: `${acc.name} (${acc.code})` }));

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Journal Entry Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isSuper && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Organization <span className="text-red-500">*</span></Label>
                                    {unqNameloading ? (
                                        <div className="h-10 bg-muted animate-pulse rounded-md" />
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
                                                    <SelectItem key={name} value={name}>{name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                                <div>
                                    <Label>Branch <span className="text-red-500">*</span></Label>
                                    {unqNameloading ? (
                                        <div className="h-10 bg-muted animate-pulse rounded-md" />
                                    ) : (
                                        <Select
                                            value={form.branchName}
                                            onValueChange={(val) => setForm({ branchName: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select branch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {branchNames.map((name) => (
                                                    <SelectItem key={name} value={name}>{name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Debit Account <span className="text-red-500">*</span></Label>
                            <Select
                                value={form.debitAccountId}
                                onValueChange={(val) => setForm({ debitAccountId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select debit account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accountOptions.map(acc => (
                                        <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Credit Account <span className="text-red-500">*</span></Label>
                            <Select
                                value={form.creditAccountId}
                                onValueChange={(val) => setForm({ creditAccountId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select credit account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accountOptions.map(acc => (
                                        <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label>Amount (TK) <span className="text-red-500">*</span></Label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter amount"
                            value={form.amount}
                            onChange={(e) => setForm({ amount: parseFloat(e.target.value) || 0 })}
                        />
                    </div>

                    <div>
                        <Label>Reference Type</Label>
                        <Select
                            value={form.referenceType}
                            onValueChange={(val) => setForm({ referenceType: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select reference type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Manual">Manual</SelectItem>
                                <SelectItem value="Sale">Sale</SelectItem>
                                <SelectItem value="Purchase">Purchase</SelectItem>
                                <SelectItem value="Expense">Expense</SelectItem>
                                <SelectItem value="Drawing">Drawing</SelectItem>
                                <SelectItem value="Capital">Capital</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Reference ID (optional)</Label>
                        <Input
                            placeholder="Reference document ID"
                            value={form.referenceId}
                            onChange={(e) => setForm({ referenceId: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label>Note</Label>
                        <Textarea
                            placeholder="Additional notes"
                            value={form.note}
                            onChange={(e) => setForm({ note: e.target.value })}
                            rows={3}
                        />
                    </div>

                    {!isSuper && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <Info className="h-4 w-4" />
                            <span>Organization and branch are automatically assigned based on your session.</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button className="w-1/2" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Processing..." : "Create Journal Entry"}
                </Button>
                <Button className="w-1/2" type="button" variant="outline" onClick={resetForm} disabled={submitting}>
                    Reset
                </Button>
            </div>
        </div>
    );
}