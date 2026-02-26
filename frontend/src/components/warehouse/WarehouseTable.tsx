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
import { WarehouseItem } from "@/types/warehouse";
import WarehouseActions from "./WarehouseActions";

interface Props {
    warehouses: WarehouseItem[];
}

export default function WarehouseTable({ warehouses }: Props) {
    return (
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {warehouses.map((warehouse) => (
                        <TableRow key={warehouse._id}>
                            <TableCell className="font-medium">{warehouse.name}</TableCell>
                            <TableCell>{warehouse.location}</TableCell>
                            <TableCell>{warehouse.capacity}</TableCell>
                            <TableCell>
                                {warehouse.branchName || warehouse.branchId?.name || "N/A"}
                            </TableCell>
                            <TableCell>
                                <Badge variant={warehouse.isActive ? "default" : "secondary"}>
                                    {warehouse.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <WarehouseActions warehouse={warehouse} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {warehouses.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                                No warehouses found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}