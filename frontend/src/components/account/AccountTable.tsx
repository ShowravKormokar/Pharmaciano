"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AccountItem } from "@/types/account";
import AccountActions from "./AccountActions";

interface Props {
    accounts: AccountItem[];
}

export default function AccountTable({ accounts }: Props) {
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
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Parent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accounts.map((account) => (
                        <TableRow key={account._id}>
                            <TableCell className="font-medium">{account.name}</TableCell>
                            <TableCell>{account.code}</TableCell>
                            <TableCell>{getTypeBadge(account.type)}</TableCell>
                            <TableCell>{account.parentId?.name || "—"}</TableCell>
                            <TableCell>
                                <Badge variant={account.isActive ? "default" : "secondary"}>
                                    {account.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <AccountActions account={account} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {accounts.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                                No accounts found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}