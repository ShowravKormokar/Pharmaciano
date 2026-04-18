"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PurchaseTableSkeleton() {
    return (
        <div className="rounded-xl border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Purchase No.</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (<TableRow key={i}>
                        <TableCell>
                            <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                            </div>
                        </TableCell>
                    </TableRow>))}
                </TableBody>
            </Table>
        </div>
    );
}