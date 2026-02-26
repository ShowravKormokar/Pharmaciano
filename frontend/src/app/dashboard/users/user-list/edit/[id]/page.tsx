"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/user.store";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/users/UserForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditUserPage() {
    const { id } = useParams();
    const router = useRouter();
    const { users, fetchUsers, setForm } = useUserStore(); // removed form from destructuring
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid user ID");
                setLoading(false);
                return;
            }

            // Try to find user in existing list
            let user = users.find((u) => u._id === id);

            // If not found and users not loaded, fetch them
            if (!user && users.length === 0) {
                await fetchUsers();
                user = users.find((u) => u._id === id);
            }

            if (!user) {
                setError("User not found");
                setLoading(false);
                return;
            }

            // ✅ Always set form with this user's data, overwriting any previous form state
            setForm({
                email: user.email,
                password: "", // don't prefill password
                name: user.name,
                role: user.roleId?.name || "",
                orgName: user.organizationId?.name || "",
                branchName: user.branchId?.name || "",
                warehouseName: "",
                phone: user.phone || "",
                isActive: user.isActive,
            });
            setLoading(false);
        };

        loadUser();
    }, [id, users, fetchUsers, setForm]); // removed form from dependencies

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

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

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Edit User</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <UserForm userId={id as string} onSuccess={() => router.push("/dashboard/users/user-list")} />
        </div>
    );
}