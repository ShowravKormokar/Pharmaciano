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
import { RoleItem } from "@/types/role";

interface Props {
    role: RoleItem;
}

export default function RoleActions({ role }: Props) {
    const router = useRouter();
    const deleteRole = useRoleStore((state) => state.deleteRole);

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() =>
                    router.push(`/dashboard/users/role-list/edit/${role._id}`)
                }
            >
                Edit
            </Button>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        Delete
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
                        <AlertDialogAction onClick={() => deleteRole(role._id)}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};