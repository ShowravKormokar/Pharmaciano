"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { AccountItem } from "@/types/account";

interface Props {
    account: AccountItem;
}

export default function AccountView({ account }: Props) {
    const router = useRouter();

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'asset': return <Badge className="bg-blue-100 text-blue-800">Asset</Badge>;
            case 'liability': return <Badge className="bg-red-100 text-red-800">Liability</Badge>;
            case 'income': return <Badge className="bg-green-100 text-green-800">Income</Badge>;
            case 'expense': return <Badge className="bg-orange-100 text-orange-800">Expense</Badge>;
            case 'equity': return <Badge className="bg-purple-100 text-purple-800">Equity</Badge>;
            default: return <Badge>{type}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Account Details</h1>
                <Button variant="outline" onClick={() => router.back()}>Back</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{account.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Code</p>
                            <p className="font-medium">{account.code}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Type</p>
                            {getTypeBadge(account.type)}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Parent Account</p>
                            <p>{account.parentId?.name || "—"}</p>
                            {account.parentId && (
                                <p className="text-xs text-muted-foreground">
                                    Code: {account.parentId.code} | Type: {account.parentId.type}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Organization</p>
                            <p className="capitalize">{account.organizationId?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={account.isActive ? "default" : "secondary"}>
                                {account.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>{account.createdAt ? format(new Date(account.createdAt), "PPP p") : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>{account.updatedAt ? format(new Date(account.updatedAt), "PPP p") : "N/A"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}