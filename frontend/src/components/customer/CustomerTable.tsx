"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CustomerSummary } from "@/lib/dashboardHelpers";

interface Props {
    customers: CustomerSummary[];
}

export default function CustomerTable({ customers }: Props) {
    return (
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Total Orders</TableHead>
                        <TableHead className="text-right">Total Spent</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium capitalize">{customer.name}</TableCell>
                            <TableCell>{customer.phone || "—"}</TableCell>
                            <TableCell className="text-right">{customer.totalOrders}</TableCell>
                            <TableCell className="text-right">TK. {customer.totalSpent.toFixed(2)}/-</TableCell>
                        </TableRow>
                    ))}
                    {customers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                No customers found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}