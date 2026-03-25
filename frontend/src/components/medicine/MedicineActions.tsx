"use client";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMedicineStore } from "@/store/medicine.store";
import { MedicineItem } from "@/types/medicine";

interface Props {
    medicine: MedicineItem;
}

export default function MedicineActions({ medicine }: Props) {
    const router = useRouter();
    const deleteMedicine = useMedicineStore((state) => state.deleteMedicine);
    const setForm = useMedicineStore((state) => state.setForm);

    const handleEdit = () => {
        setForm({
            name: medicine.name,
            genericName: medicine.genericName || "",
            categoryName: medicine.categoryName || "",
            brandName: medicine.brandName || "",
            dosageForm: medicine.dosageForm || "",
            strength: medicine.strength || "",
            unit: medicine.unit || "",
            unitPrice: medicine.unitPrice || 0,
            unitsPerStrip: medicine.unitsPerStrip || 0,
            isPrescriptionRequired: medicine.isPrescriptionRequired || false,
            taxRate: medicine.taxRate || 0,
            isActive: medicine.isActive,
        });
        router.push(`/dashboard/inventory/medicines/edit/${medicine._id}`);
    };

    const handleDelete = async (id: string) => {
        await deleteMedicine(id);
    };

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/inventory/medicines/view/${medicine._id}`)}
                title="View"
                className="border-[0.1rem] rounded-md"
            >
                <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit} title="Edit">
                <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" title="Delete">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Medicine?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the medicine.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(medicine._id)}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}