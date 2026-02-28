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
import { BrandItem } from "@/types/brand";
import BrandActions from "./BrandActions";

interface Props {
    brands: BrandItem[];
}

export default function BrandTable({ brands }: Props) {
    return (
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {brands.map((brand) => (
                        <TableRow key={brand._id}>
                            <TableCell className="font-medium">{brand.name}</TableCell>
                            <TableCell>{brand.manufacturer}</TableCell>
                            <TableCell>{brand.country}</TableCell>
                            <TableCell>
                                <Badge variant={brand.isActive ? "default" : "secondary"}>
                                    {brand.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <BrandActions brand={brand} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {brands.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                                No brands found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}