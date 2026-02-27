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
import { OrganizationItem } from "@/types/organization";
import OrganizationActions from "./OrganizationActions";

interface Props {
    organizations: OrganizationItem[];
}

export default function OrganizationTable({ organizations }: Props) {
    return (
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {organizations.map((org) => (
                        <TableRow key={org._id}>
                            <TableCell className="font-medium">{org.name}</TableCell>
                            <TableCell>{org.contact.email}</TableCell>
                            <TableCell>{org.contact.phone}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{org.subscriptionPlan}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={org.isActive ? "default" : "secondary"}>
                                    {org.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <OrganizationActions organization={org} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {organizations.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                                No organizations found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}