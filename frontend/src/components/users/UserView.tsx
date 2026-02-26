"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Pencil } from "lucide-react";

interface UserViewProps {
    user: any;
}

export default function UserView({ user }: UserViewProps) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">User Details</h1>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/dashboard/users/edit/${user._id}`)}
                        title="Edit"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => router.back()}>
                        Back
                    </Button>
                </div>
            </div>

            {/* User Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p>{user.phone || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={user.isActive ? "default" : "secondary"}>
                                {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    {/* Role Information */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Role</p>
                        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                            <p className="font-medium">{user.roleId?.name || "N/A"}</p>
                            {user.roleId?.permissions && (
                                <div className="flex flex-wrap gap-2">
                                    {user.roleId.permissions.map((perm: string) => (
                                        <Badge key={perm} variant="outline">
                                            {perm}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Organization & Branch */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Organization</p>
                            <p className="font-medium">{user.organizationId?.name || "N/A"}</p>
                            {user.organizationId?.address && (
                                <p className="text-sm text-muted-foreground">
                                    {user.organizationId.address}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Branch</p>
                            <p className="font-medium">{user.branchId?.name || "N/A"}</p>
                            {user.branchId?.address && (
                                <p className="text-sm text-muted-foreground">
                                    {user.branchId.address}
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p>{user.createdBy?.name || "System"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>
                                {user.createdAt
                                    ? format(new Date(user.createdAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>
                                {user.updatedAt
                                    ? format(new Date(user.updatedAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Login</p>
                            <p>
                                {user.lastLogin
                                    ? format(new Date(user.lastLogin), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}