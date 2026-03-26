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
import { Eye, Pencil, Trash2, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSaleStore } from "@/store/sale.store";
import { SaleItem } from "@/types/sale";

interface Props {
    sale: SaleItem;
}

export default function SalesActions({ sale }: Props) {
    const router = useRouter();
    const deleteSale = useSaleStore((state) => state.deleteSale);

    const handleDelete = async () => {
        await deleteSale(sale._id);
    };

    const handlePrint = () => {
        window.open(`/dashboard/sales/print/${sale._id}`, '_blank');
        //window.print()
    };

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/sales/view/${sale._id}`)}
                title="View"
                className="border-[0.1rem] rounded-md"
            >
                <Eye className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/sales/edit/${sale._id}`)}
                title="Edit"
                className="border-[0.1rem] rounded-md"
            >
                <Pencil className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                title="Print Invoice"
                className="border-[0.1rem] rounded-md"
            >
                <Printer className="h-4 w-4" />
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" title="Delete">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Sale?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the sale record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}