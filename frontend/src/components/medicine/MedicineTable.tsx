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
import { MedicineItem } from "@/types/medicine";
import MedicineActions from "./MedicineActions";

interface Props {
    medicines: MedicineItem[];
}

export default function MedicineTable({ medicines }: Props) {
    return (
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Generic Name</TableHead>
                        {/* <TableHead>Category</TableHead>
                        <TableHead>Brand</TableHead> */}
                        <TableHead>Dosage Form</TableHead>
                        <TableHead>Strength</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Prescription Required</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {medicines.map((med) => (
                        <TableRow key={med._id}>
                            <TableCell className="font-medium capitalize">{med.name}</TableCell>
                            <TableCell className="capitalize">{med.genericName || "—"}</TableCell>
                            {/* <TableCell>{med.categoryName || "—"}</TableCell>
                            <TableCell>{med.brandName || "—"}</TableCell> */}
                            <TableCell className="capitalize">{med.dosageForm || "—"}</TableCell>
                            <TableCell>{med.strength ? `${med.strength} ${med.unit || ""}` : "—"}</TableCell>
                            <TableCell>{med.unitPrice?.toFixed(2) || "—"}/=</TableCell>
                            <TableCell>
                                {med.isPrescriptionRequired ? (
                                    <Badge variant="destructive">Required</Badge>
                                ) : (
                                    <Badge variant="outline">OTC</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant={med.isActive ? "default" : "secondary"}>
                                    {med.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <MedicineActions medicine={med} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {medicines.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center text-muted-foreground py-6">
                                No medicines found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}