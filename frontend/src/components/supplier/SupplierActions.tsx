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
import { useSupplierStore } from "@/store/supplier.store";
import { SupplierItem } from "@/types/supplier";

interface Props {
    supplier: SupplierItem;
}

export default function SupplierActions({ supplier }: Props) {
    const router = useRouter();
    const deleteSupplier = useSupplierStore((state) => state.deleteSupplier);
    const setForm = useSupplierStore((state) => state.setForm);

    const handleEdit = () => {
        setForm({
            name: supplier.name,
            contactPerson: supplier.contactPerson || "",
            phone: supplier.phone || "",
            email: supplier.email || "",
            address: supplier.address || "",
            isActive: supplier.isActive,
        });
        router.push(`/dashboard/contacts/suppliers/edit/${supplier._id}`);
    };

    const handleDelete = async (id: string) => {
        const success = await deleteSupplier(id);
        if (!success) {
            // toast already shown in store
        }
    };

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/contacts/suppliers/view/${supplier._id}`)}
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
                        <AlertDialogTitle>Delete Supplier?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the supplier.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(supplier._id)}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}