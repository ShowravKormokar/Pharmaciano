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
import { Eye, Pencil, Trash2, CheckCircle, PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePurchaseStore } from "@/store/purchase.store";
import { PurchaseItem } from "@/types/purchase";
import { useState } from "react";
import ReceivePurchaseModal from "./ReceivePurchaseModal";

interface Props {
    purchase: PurchaseItem;
}

export default function PurchaseActions({ purchase }: Props) {
    const router = useRouter();
    const { approvePurchase, deletePurchase } = usePurchaseStore();
    const [receiveModalOpen, setReceiveModalOpen] = useState(false);

    const handleApprove = async () => {
        await approvePurchase(purchase._id);
    };

    const handleDelete = async () => {
        await deletePurchase(purchase._id);
    };

    return (
        <>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/purchase/view/${purchase._id}`)} title="View" className="border-[0.1rem] rounded-md">
                    <Eye className="h-4 w-4" />
                </Button>
                {purchase.status === 'pending' && (
                    <Button variant="ghost" size="sm" onClick={handleApprove} title="Approve" className="border-[0.1rem] rounded-md text-blue-600">
                        <CheckCircle className="h-4 w-4" />
                    </Button>
                )}
                {purchase.status === 'approved' && (
                    <Button variant="ghost" size="sm" onClick={() => setReceiveModalOpen(true)} title="Receive" className="border-[0.1rem] rounded-md text-green-600">
                        <PackageCheck className="h-4 w-4" />
                    </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/purchase/edit/${purchase._id}`)} title="Edit" className="border-[0.1rem] rounded-md">
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
                            <AlertDialogTitle>Delete Purchase?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <ReceivePurchaseModal purchase={purchase} open={receiveModalOpen} onOpenChange={setReceiveModalOpen} />
        </>
    );
};