// app/dashboard/users/role-list/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRoleStore } from "@/store/role.store";
import { Button } from "@/components/ui/button";
import RoleForm from "@/components/roles/RoleForm";

export default function RoleEditPage() {
    const { id } = useParams();
    const router = useRouter();
    const { roles, fetchRoles, setForm, form } = useRoleStore();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRole = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid role ID");
                setLoading(false);
                return;
            }

            // If form is already populated (from RoleActions), we can use it directly
            if (form.name) {
                setLoading(false);
                return;
            }

            // Otherwise, try to find the role in the already fetched roles list
            let role = roles.find((r) => r._id === id);

            // If roles are not loaded yet, fetch them
            if (!role && roles.length === 0) {
                await fetchRoles();
                role = roles.find((r) => r._id === id);
            }

            if (!role) {
                setError("Role not found");
                setLoading(false);
                return;
            }

            // Pre-fill the form with the role data
            setForm({
                name: role.name,
                description: role.description || "",
                permissions: role.permissions || [],
                isActive: role.isActive ?? true,
            });

            setLoading(false);
        };

        loadRole();
    }, [id, roles, form.name, fetchRoles, setForm]);

    if (loading) return <p className="p-6">Loading role...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Edit Role</h1>

            {/* Pass roleId and onSuccess callback */}
            <RoleForm roleId={id as string} onSuccess={() => router.push("/dashboard/users/role-list")} />

            <Button variant="outline" onClick={() => router.back()}>
                Back
            </Button>
        </div>
    );
}