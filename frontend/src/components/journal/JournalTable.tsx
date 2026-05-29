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
import { JournalItem } from "@/types/journal";
import { format } from "date-fns";
import JournalActions from "./JournalActions";

interface Props {
    journals: JournalItem[];
}

export default function JournalTable({ journals }: Props) {
    const getAccountName = (account: any) => {
        if (typeof account === 'object' && account?.name) return account.name;
        return "N/A";
    };

    return (
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Debit Account</TableHead>
                        <TableHead>Credit Account</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reference Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {journals.map((journal) => (
                        <TableRow key={journal._id}>
                            <TableCell>{format(new Date(journal.createdAt), "PP")}</TableCell>
                            <TableCell>{getAccountName(journal.debitAccountId)}</TableCell>
                            <TableCell>{getAccountName(journal.creditAccountId)}</TableCell>
                            <TableCell>TK. {journal.amount.toFixed(2)}/-</TableCell>
                            <TableCell>
                                <Badge variant="outline">{journal.referenceType}</Badge>
                            </TableCell>
                            <TableCell>
                                {journal.isReversed ? (
                                    <Badge variant="destructive">Reversed</Badge>
                                ) : (
                                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <JournalActions journal={journal} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {journals.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                                No journal entries found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}