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
import { BranchItem } from "@/types/branch";
import BranchActions from "./BranchActions";

interface Props {
    branches: BranchItem[];
}

export default function BranchTable({ branches }: Props) {
    return (
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {branches.map((branch) => (
                        <TableRow key={branch._id}>
                            <TableCell className="font-medium">{branch.name}</TableCell>
                            <TableCell>{branch.address}</TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    <div>{branch.contact?.email}</div>
                                    <div className="text-muted-foreground">{branch.contact?.phone}</div>
                                </div>
                            </TableCell>
                            <TableCell>{branch.organization?.name || branch.orgName || "N/A"}</TableCell>
                            <TableCell>
                                <Badge variant={branch.isActive ? "default" : "secondary"}>
                                    {branch.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <BranchActions branch={branch} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {branches.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                                No branches found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}