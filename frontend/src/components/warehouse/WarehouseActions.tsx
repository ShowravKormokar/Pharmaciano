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
import { useWarehouseStore } from "@/store/warehouse.store";
import { WarehouseItem } from "@/types/warehouse";

interface Props {
    warehouse: WarehouseItem;
}

export default function WarehouseActions({ warehouse }: Props) {
    const router = useRouter();
    const deleteWarehouse = useWarehouseStore((state) => state.deleteWarehouse);
    const setForm = useWarehouseStore((state) => state.setForm);

    const handleEdit = () => {
        setForm({
            name: warehouse.name,
            location: warehouse.location,
            capacity: warehouse.capacity,
            branchName: warehouse.branchName || warehouse.branchId?.name || "",
            isActive: warehouse.isActive,
        });
        router.push(`/dashboard/warehouses/edit/${warehouse._id}`);
    };

    const handleDelete = async (id: string) => {
        const success = await deleteWarehouse(id);
        if (!success) {
            alert("Failed to delete warehouse. Please try again.");
        }
    };

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/warehouses/view/${warehouse._id}`)}
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
                        <AlertDialogTitle>Delete Warehouse?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the warehouse.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(warehouse._id)}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}