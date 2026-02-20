"use client";

import { useEffect } from "react";
import { useRoleStore } from "@/store/role.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleForm from "@/components/roles/RoleForm";

export default function AddRolePage() {
    const { resetForm } = useRoleStore();

    // Reset form when entering Add page
    useEffect(() => {
        resetForm();
    }, []);

    return (
        <div className="p-6 space-y-6 max-w-4xl">
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle>Create New Role</CardTitle>
                </CardHeader>
                <CardContent>
                    <RoleForm />
                </CardContent>
            </Card>
        </div>
    );
};