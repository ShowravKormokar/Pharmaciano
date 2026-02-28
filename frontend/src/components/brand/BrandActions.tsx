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
import { useBrandStore } from "@/store/brand.store";
import { BrandItem } from "@/types/brand";

interface Props {
    brand: BrandItem;
}

export default function BrandActions({ brand }: Props) {
    const router = useRouter();
    const deleteBrand = useBrandStore((state) => state.deleteBrand);
    const setForm = useBrandStore((state) => state.setForm);

    const handleEdit = () => {
        setForm({
            name: brand.name,
            manufacturer: brand.manufacturer,
            country: brand.country,
            isActive: brand.isActive,
        });
        router.push(`/dashboard/inventory/brands/edit/${brand._id}`);
    };

    const handleDelete = async (id: string) => {
        const success = await deleteBrand(id);
        if (!success) {
            // toast already shown in store
        }
    };

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/inventory/brands/view/${brand._id}`)}
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
                        <AlertDialogTitle>Delete Brand?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the brand.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(brand._id)}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}