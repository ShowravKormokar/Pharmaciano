"use client";

import { useRoleStore } from "@/store/role.store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { Eye, Pencil, Trash2 } from "lucide-react"; // Import icons
import { RoleItem } from "@/types/role";

interface Props {
    role: RoleItem;
}

export default function RoleActions({ role }: Props) {
    const router = useRouter();
    const deleteRole = useRoleStore((state) => state.deleteRole);
    const setForm = useRoleStore((state) => state.setForm);

    const handleEdit = () => {
        setForm({
            name: role.name,
            description: role.description || "",
            permissions: role.permissions || [],
            isActive: role.isActive ?? true,
        });
        router.push(`/dashboard/users/role-list/edit/${role._id}`);
    };

    const handleView = () => {
        router.push(`/dashboard/users/role-list/view/${role._id}`);
    };

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleView}
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
                        <AlertDialogTitle>Delete Role?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                const success = await deleteRole(role._id);
                                if (!success) {
                                    alert("Failed to delete role. Please try again.");
                                }
                            }}
                        >
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}