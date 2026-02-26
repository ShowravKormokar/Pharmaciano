"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user.store";
import { useRoleStore } from "@/store/role.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Shield, UserPlus, ShieldPlus, Eye } from "lucide-react";
import Link from "next/link";

export default function UsersOverviewPage() {
    const router = useRouter();
    const { users, fetchUsers, loading: usersLoading } = useUserStore();
    const { roles, fetchRoles, loading: rolesLoading } = useRoleStore();

    const [metrics, setMetrics] = useState({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        totalRoles: 0,
    });

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [fetchUsers, fetchRoles]);

    useEffect(() => {
        if (users.length) {
            const active = users.filter((u) => u.isActive).length;
            setMetrics({
                totalUsers: users.length,
                activeUsers: active,
                inactiveUsers: users.length - active,
                totalRoles: roles.length,
            });
        } else {
            setMetrics((prev) => ({ ...prev, totalRoles: roles.length }));
        }
    }, [users, roles]);

    const loading = usersLoading || rolesLoading;

    // Recent items (last 5 by createdAt)
    const recentUsers = [...users]
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        })
        .slice(0, 5);

    const recentRoles = [...roles]
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        })
        .slice(0, 5);

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">User Management Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Monitor users, roles and system activity.
                </p>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Users"
                    value={metrics.totalUsers}
                    icon={<Users className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Active Users"
                    value={metrics.activeUsers}
                    icon={<Users className="h-5 w-5 text-green-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Inactive Users"
                    value={metrics.inactiveUsers}
                    icon={<Users className="h-5 w-5 text-red-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Total Roles"
                    value={metrics.totalRoles}
                    icon={<Shield className="h-5 w-5" />}
                    loading={loading}
                />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/users/user-list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View User List
                    </Button>
                </Link>
                <Link href="/dashboard/users/role-list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Role List
                    </Button>
                </Link>
                <Link href="/dashboard/users/user-list/add">
                    <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create User
                    </Button>
                </Link>
                <Link href="/dashboard/users/role-list/add">
                    <Button>
                        <ShieldPlus className="h-4 w-4 mr-2" />
                        Create Role
                    </Button>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Users */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : recentUsers.length > 0 ? (
                            <div className="space-y-3">
                                {recentUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className="flex items-center justify-between p-2 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {user.email} • {user.roleId?.name || "No role"}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                router.push(`/dashboard/users/user-list/view/${user._id}`)
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No users found.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Roles */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : recentRoles.length > 0 ? (
                            <div className="space-y-3">
                                {recentRoles.map((role) => (
                                    <div
                                        key={role._id}
                                        className="flex items-center justify-between p-2 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{role.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {role.description || "No description"} •{" "}
                                                {role.permissions.length} permissions
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                router.push(`/dashboard/users/role-list/view/${role._id}`)
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No roles found.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Helper component for metric cards
function MetricCard({ title, value, icon, loading }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-16" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    );
}

// <RoleGuard roles={["SUPER_ADMIN", "MANAGER"]}>
//     <UserList />
// </RoleGuard>