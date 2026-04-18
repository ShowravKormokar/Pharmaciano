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
import { PurchaseItem } from "@/types/purchase";
import { format } from "date-fns";
import PurchaseActions from "./PurchaseActions";

interface Props {
    purchases: PurchaseItem[];
}

export default function PurchaseTable({ purchases }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'approved': return <Badge variant="outline" className="bg-blue-100 text-blue-800">Approved</Badge>;
            case 'received': return <Badge variant="outline" className="bg-green-100 text-green-800">Received</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    const getPaymentBadge = (status: string) => {
        switch (status) {
            case 'paid': return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
            case 'partial': return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
            default: return <Badge variant="outline">Unpaid</Badge>;
        }
    };

    return (
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Purchase No.</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {purchases.map((purchase) => (
                        <TableRow key={purchase._id}>
                            <TableCell className="font-medium">{purchase.purchaseNo}</TableCell>
                            <TableCell className="capitalize">{purchase.supplierId.name}</TableCell>
                            <TableCell>{format(new Date(purchase.createdAt), "PP")}</TableCell>
                            <TableCell>TK. {purchase.totalAmount.toFixed(2)}/-</TableCell>
                            <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                            <TableCell>{getPaymentBadge(purchase.paymentStatus)}</TableCell>
                            <TableCell className="text-right">
                                <PurchaseActions purchase={purchase} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {purchases.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-6">No purchases found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};