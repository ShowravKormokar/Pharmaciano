"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchRoleByIdService, RoleItem } from "@/services/role.service";
import { Button } from "@/components/ui/button";

export default function RoleEditPage() {
    const { id } = useParams();
    const router = useRouter();
    const [role, setRole] = useState<RoleItem | null>(null);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     if (!id) return;
    //     fetchRoleByIdService(id)
    //         .then((res) => setRole(res.data))
    //         .finally(() => setLoading(false));
    // }, [id]);

    if (loading) return <p className="p-6">Loading role...</p>;
    if (!role) return <p className="p-6 text-red-500">Role not found</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Edit Role: {role.name}</h1>
            {/* Add your form here */}
            <Button onClick={() => router.back()}>Back</Button>
        </div>
    );
}
