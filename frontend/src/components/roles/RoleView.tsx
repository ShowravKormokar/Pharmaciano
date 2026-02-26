"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleItem } from "@/types/role";
import { UserItem } from "@/types/user";
import { format } from "date-fns";

interface Props {
    role: RoleItem;
    users: UserItem[];
    usersLoading?: boolean;
}

export default function RoleView({ role, users, usersLoading = false }: Props) {
    const router = useRouter();

    // Filter users that have this role
    // Assuming user.role is an object with _id
    const usersWithRole = users.filter(
        (user) => user.roleId?.name === role.name
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Role Details</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>

            {/* Role Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Role Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Role Name</p>
                            <p className="font-medium">{role.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={role.isActive ? "default" : "secondary"}>
                                {role.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p>{role.description || "No description"}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Permissions</p>
                        <div className="flex flex-wrap gap-2">
                            {role.permissions.map((perm) => (
                                <Badge key={perm} variant="outline">
                                    {perm}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p>
                                {role.createdBy?.name || role.createdBy?.email || "System"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>
                                {role.createdAt
                                    ? format(new Date(role.createdAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>
                                {role.updatedAt
                                    ? format(new Date(role.updatedAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users with this Role Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Users with this Role ({usersWithRole.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {usersLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : usersWithRole.length > 0 ? (
                        <div className="space-y-2">
                            {usersWithRole.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between p-2 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.push(`/dashboard/users/view/${user._id}`)
                                        }
                                    >
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No users assigned to this role.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}