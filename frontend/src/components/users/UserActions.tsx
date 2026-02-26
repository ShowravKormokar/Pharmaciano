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
import { useUserStore } from "@/store/user.store";
import { UserItem } from "@/types/user";

interface Props {
    user: UserItem;
}

export default function UserActions({ user }: Props) {
    const router = useRouter();
    const deleteUser = useUserStore((state) => state.deleteUser);
    const setForm = useUserStore((state) => state.setForm);

    const handleEdit = () => {
        setForm({
            email: user.email,
            password: "",
            name: user.name,
            role: user.roleId?.name || "",
            orgName: user.organizationId?.name || "",
            branchName: user.branchId?.name || "",
            warehouseName: "",
            phone: user.phone || "",
            isActive: user.isActive,
        });
        router.push(`/dashboard/users/user-list/edit/${user._id}`);
    };

    const handleDelete = async (id: string) => {
        const success = await deleteUser(id);
        if (!success) {
            alert("Failed to delete user. Please try again.");
        }
    };

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/users/user-list/view/${user._id}`)}
                title="View"
                className="border-[0.1rem] rounded-md"
            >
                <Eye className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
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
                        <AlertDialogAction onClick={() => handleDelete(user._id)}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}