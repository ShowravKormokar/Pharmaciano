"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { JournalItem } from "@/types/journal";

interface Props {
    journal: JournalItem;
}

export default function JournalView({ journal }: Props) {
    const router = useRouter();

    const getAccountDetails = (account: any) => {
        if (typeof account === 'object') {
            return `${account.name} (${account.code}) - ${account.type}`;
        }
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
                            <p>{format(new Date(journal.createdAt), "PPP p")}</p>
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
                            <p className="font-semibold">TK. {journal.amount.toFixed(2)}/-</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Reference Type</p>
                            <p>{journal.referenceType}</p>
                        </div>
                        {journal.referenceId && (
                            <div>
                                <p className="text-sm text-muted-foreground">Reference ID</p>
                                <p>{journal.referenceId}</p>
                            </div>
                        )}
                        {journal.note && (
                            <div className="md:col-span-2">
                                <p className="text-sm text-muted-foreground">Note</p>
                                <p className="whitespace-pre-wrap">{journal.note}</p>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Organization</p>
                            <p>{typeof journal.organizationId === 'object' ? journal.organizationId?.name : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Branch</p>
                            <p>{typeof journal.branchId === 'object' ? journal.branchId?.name : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>{format(new Date(journal.createdAt), "PPP p")}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>{format(new Date(journal.updatedAt), "PPP p")}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}