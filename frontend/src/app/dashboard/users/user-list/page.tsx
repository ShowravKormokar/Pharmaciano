"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user.store";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function UserList() {
    const { users, fetchUsers, removeUser, loading } = useUserStore();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    if (loading) return <div className="p-6">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="rounded-xl border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.roleId.name}</TableCell>
                                <TableCell>
                                    {user.isActive ? (
                                        <span className="text-green-600 font-medium">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-medium">
                                            Inactive
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell className="text-right space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            router.push(`/dashboard/users/view/${user._id}`)
                                        }
                                    >
                                        View
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() =>
                                            router.push(`/dashboard/users/edit/${user._id}`)
                                        }
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => setDeleteId(user._id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>

                    <p>Are you sure you want to delete this user?</p>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (deleteId) removeUser(deleteId);
                                setDeleteId(null);
                            }}
                        >
                            Confirm Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};