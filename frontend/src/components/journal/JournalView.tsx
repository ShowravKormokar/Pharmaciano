"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface Props {
    journal: any; // Accept any data, but we'll check
}

export default function JournalView({ journal }: Props) {
    const router = useRouter();

    // Helper to safely get a string from any value
    const safeString = (value: any): string => {
        if (value === null || value === undefined) return "N/A";
        if (typeof value === "string") return value;
        if (typeof value === "number") return String(value);
        if (typeof value === "boolean") return String(value);
        if (typeof value === "object") {
            if (value instanceof Date) return format(value, "PPP p");
            if (value.name) return value.name;
            if (value._id) return value._id;
            return JSON.stringify(value);
        }
        return String(value);
    };

    // Check if this is actually a journal entry (has debitAccountId)
    const isJournal = journal && journal.debitAccountId;

    if (!isJournal) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Journal Entry Details</h1>
                    <Button variant="outline" onClick={() => router.back()}>Back</Button>
                </div>
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">The requested data is not a valid journal entry.</p>
                        <p className="text-sm text-muted-foreground mt-2">Please check the ID and try again.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getAccountDetails = (account: any): string => {
        if (!account) return "N/A";
        if (typeof account === "string") return account;
        if (typeof account === "object") {
            let parts = [];
            if (account.name) parts.push(account.name);
            if (account.code) parts.push(`(${account.code})`);
            if (account.type) parts.push(`- ${account.type}`);
            return parts.join(" ") || "N/A";
        }
        return String(account);
    };

    const getOrgBranchName = (obj: any): string => {
        if (!obj) return "N/A";
        if (typeof obj === "string") return obj;
        if (typeof obj === "object" && obj.name) return obj.name;
        return "N/A";
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Journal Entry Details</h1>
                <Button variant="outline" onClick={() => router.back()}>Back</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Journal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p>{journal.createdAt ? format(new Date(journal.createdAt), "PPP p") : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            {journal.isReversed ? (
                                <Badge variant="destructive">Reversed</Badge>
                            ) : (
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Debit Account</p>
                            <p>{getAccountDetails(journal.debitAccountId)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Credit Account</p>
                            <p>{getAccountDetails(journal.creditAccountId)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="font-semibold">TK. {journal.amount ? journal.amount.toFixed(2) : "0.00"}/-</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Reference Type</p>
                            <p>{safeString(journal.referenceType)}</p>
                        </div>
                        {journal.referenceId && (
                            <div>
                                <p className="text-sm text-muted-foreground">Reference</p>
                                {typeof journal.referenceId === 'object' && journal.referenceId !== null ? (
                                    <div className="bg-muted/30 p-3 rounded-lg space-y-1 text-sm">
                                        {journal.referenceId.invoiceNo && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Invoice:</span>
                                                <span className="font-medium">{journal.referenceId.invoiceNo}</span>
                                            </div>
                                        )}
                                        {journal.referenceId.customerPhone && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Customer Phone:</span>
                                                <span className="font-medium">{journal.referenceId.customerPhone}</span>
                                            </div>
                                        )}
                                        {journal.referenceId.totalAmount !== undefined && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Total Amount:</span>
                                                <span className="font-medium">TK. {journal.referenceId.totalAmount.toFixed(2)}/-</span>
                                            </div>
                                        )}
                                        {Object.keys(journal.referenceId).filter(k => !['invoiceNo', 'customerPhone', 'totalAmount'].includes(k)).map(key => (
                                            <div key={key} className="flex justify-between">
                                                <span className="text-muted-foreground">{key}:</span>
                                                <span className="font-medium">{String(journal.referenceId[key])}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>{safeString(journal.referenceId)}</p>
                                )}
                            </div>
                        )}
                        {journal.note && (
                            <div className="md:col-span-2">
                                <p className="text-sm text-muted-foreground">Note</p>
                                <p className="whitespace-pre-wrap">{safeString(journal.note)}</p>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Organization</p>
                            <p>{getOrgBranchName(journal.organizationId)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Branch</p>
                            <p>{getOrgBranchName(journal.branchId)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>{journal.createdAt ? format(new Date(journal.createdAt), "PPP p") : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>{journal.updatedAt ? format(new Date(journal.updatedAt), "PPP p") : "N/A"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}