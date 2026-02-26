"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/users/UserForm";
import { useUserStore } from "@/store/user.store";

export default function AddUserPage() {
    const router = useRouter();
    const resetForm = useUserStore((state) => state.resetForm);

    // Reset form to empty when entering add page
    useEffect(() => {
        resetForm();
    }, [resetForm]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New User</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <UserForm onSuccess={() => router.push("/dashboard/users/user-list")} />
        </div>
    );
}