"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/user.store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserView from "@/components/users/UserView";

export default function UserViewPage() {
    const { id } = useParams();
    const router = useRouter();
    const { users, fetchUsers, loading } = useUserStore();
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            if (!id || Array.isArray(id)) {
                setError("Invalid user ID");
                return;
            }

            // If users not loaded yet, fetch them
            if (users.length === 0 && !loading) {
                await fetchUsers();
            }

            const found = users.find((u) => u._id === id);
            if (!found) {
                setError("User not found");
                return;
            }

            setUser(found);
        };

        loadUser();
    }, [id, users, loading, fetchUsers]);

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

    if (loading || !user) {
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
            <UserView user={user} />
        </div>
    );
}