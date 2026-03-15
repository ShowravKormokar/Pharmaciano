"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/user.store";
import { fetchRoleByIdService } from "@/services/role.service"; // ✅ import service
import { Button } from "@/components/ui/button";
import RoleView from "@/components/roles/RoleView";
import { Skeleton } from "@/components/ui/skeleton";

export default function RoleViewPage() {
    const { id } = useParams();
    const router = useRouter();
    const { users, fetchUsers, loading: usersLoading } = useUserStore();

    const [role, setRole] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRole = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid role ID");
                setLoading(false);
                return;
            }

            try {
                const roleData = await fetchRoleByIdService(id);
                setRole(roleData);
            } catch (err: any) {
                setError(err?.response?.data?.message || "Failed to load role");
            } finally {
                setLoading(false);
            }
        };

        loadRole();
    }, [id]);

    // Fetch users if needed (unchanged)
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

    if (loading) {
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