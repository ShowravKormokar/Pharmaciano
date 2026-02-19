"use client";

import { useEffect } from "react";
import { useRoleStore } from "@/store/role.store";
import RoleTable from "@/components/roles/RoleTable";

export default function RoleListPage() {
    const { roles, fetchRoles, loading, error } = useRoleStore();

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    if (loading) return <p className="p-6">Loading roles...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Role Management</h1>
            <RoleTable roles={roles} />
        </div>
    );
}