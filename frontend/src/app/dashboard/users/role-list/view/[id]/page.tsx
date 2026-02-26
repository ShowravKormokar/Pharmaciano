"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRoleStore } from "@/store/role.store";
import { useUserStore } from "@/store/user.store";
import { Button } from "@/components/ui/button";
import RoleView from "@/components/roles/RoleView";
import { Skeleton } from "@/components/ui/skeleton";

export default function RoleViewPage() {
    const { id } = useParams();
    const router = useRouter();
    const { roles, fetchRoles, loading: rolesLoading } = useRoleStore();
    const { users, fetchUsers, loading: usersLoading } = useUserStore();

    const [role, setRole] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid role ID");
                return;
            }

            // Ensure roles are loaded
            if (roles.length === 0) {
                await fetchRoles();
            }

            const foundRole = roles.find((r) => r._id === id);
            if (!foundRole) {
                setError("Role not found");
                return;
            }

            setRole(foundRole);
        };

        loadData();
    }, [id, roles, fetchRoles]);

    // Fetch users if not loaded
    useEffect(() => {
        if (users.length === 0) {
            fetchUsers();
        }
    }, [users, fetchUsers]);

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-500">{error}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    if (!role || rolesLoading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <RoleView role={role} users={users} usersLoading={usersLoading} />
        </div>
    );
}