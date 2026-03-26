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
import { SaleItem } from "@/types/sale";
import { format } from "date-fns";
import SalesActions from "./SalesActions";

interface Props {
    sales: SaleItem[];
}

export default function SalesTable({ sales }: Props) {
    return (
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sales.map((sale) => (
                        <TableRow key={sale._id}>
                            <TableCell className="font-medium">{sale.invoiceNo}</TableCell>
                            <TableCell className="capitalize">{sale.customerName || "Walk-in"}</TableCell>
                            <TableCell>{format(new Date(sale.createdAt), "PP")}</TableCell>
                            <TableCell>TK. {sale.totalAmount.toFixed(2)}/-</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="capitalize">
                                    {sale.paymentMethod}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <SalesActions sale={sale} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {sales.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                                No sales found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}