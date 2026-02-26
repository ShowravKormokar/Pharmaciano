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
import { UserItem } from "@/types/user";
import { useUserStore } from "@/store/user.store";

interface Props {
    user: UserItem;
    onDelete: (id: string) => Promise<void>;
}

export default function UserActions({ user, onDelete }: Props) {
    const router = useRouter();
    const setForm = useUserStore((state) => state.setForm);

    const handleEdit = () => {
        setForm({
            email: user.email,
            password: "", // don't prefill password
            name: user.name,
            role: user.roleId?.name || "",
            orgName: user.organizationId?.name || "",
            branchName: user.branchId?.name || "",
            warehouseName: "", // we don't have this yet – could be extended
            phone: user.phone || "",
            isActive: user.isActive,
        });
        router.push(`/dashboard/users/user-list/edit/${user._id}`);
    };


    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                title="View"
                className="border-[0.1rem] rounded-md"
            >
                <Eye className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/users/user-list/edit/${user._id}`)}
                title="Edit"
            >
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
                        <AlertDialogTitle>Delete User?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(user._id)}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}