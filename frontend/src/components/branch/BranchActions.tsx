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
import { useBranchStore } from "@/store/branch.store";
import { BranchItem } from "@/types/branch";

interface Props {
    branch: BranchItem;
}

export default function BranchActions({ branch }: Props) {
    const router = useRouter();
    const deleteBranch = useBranchStore((state) => state.deleteBranch);
    const setForm = useBranchStore((state) => state.setForm);

    const handleEdit = () => {
        setForm({
            name: branch.name,
            address: branch.address,
            contact: branch.contact,
            orgName: branch.organization?.name || branch.orgName || "",
            isActive: branch.isActive,
        });
        router.push(`/dashboard/branches/edit/${branch._id}`);
    };

    const handleDelete = async (id: string) => {
        const success = await deleteBranch(id);
        if (!success) {
            alert("Failed to delete branch. Please try again.");
        }
    };

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/branches/view/${branch._id}`)}
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
                        <AlertDialogTitle>Delete Branch?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the branch.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(branch._id)}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}