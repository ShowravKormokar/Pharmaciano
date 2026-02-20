"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchRoleByIdService } from "@/services/role.service";
import { RoleItem } from "@/types/role";
import { useRoleStore } from "@/store/role.store";
import { Button } from "@/components/ui/button";
import RoleForm from "@/components/roles/RoleForm";

export default function RoleEditPage() {
    const { id } = useParams();
    const router = useRouter();
    const { setForm, resetForm } = useRoleStore();

    const [role, setRole] = useState<RoleItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRole = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid role ID");
                setLoading(false);
                return;
            }

            console.log("Fetching role with ID:", id); // Debug log

            try {
                const response = await fetchRoleByIdService(id);
                console.log("API Response:", response); // Debug log
                console.log("Response data:", response.data); // Debug log

                // Type assertion to tell TypeScript the shape of response.data
                const responseData = response.data as {
                    success: boolean;
                    message: string;
                    data: RoleItem;
                };

                const roleData = responseData?.data;

                if (!roleData || !roleData._id) {
                    setError("Role not found or invalid response structure");
                    console.error("Unexpected response structure:", response.data);
                } else {
                    setRole(roleData);
                    setForm({
                        name: roleData.name,
                        description: roleData.description || "",
                        permissions: roleData.permissions || [],
                    });
                }
            } catch (err: any) {
                console.error("Error fetching role:", err);
                console.error("Error response:", err?.response); // Debug log
                console.error("Error data:", err?.response?.data); // Debug log
                setError(err?.response?.data?.message || "Failed to fetch role");
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, [id]);

    if (loading) return <p className="p-6">Loading role...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!role) return <p className="p-6 text-red-500">Role not found</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Edit Role: {role.name}</h1>

            {/* Use RoleForm for editing */}
            <RoleForm roleId={role._id} />

            <Button variant="outline" onClick={() => router.back()}>
                Back
            </Button>
        </div>
    );
};