// app/dashboard/users/role-list/features/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import RoleFeatures from "@/components/roles/RoleFeatures";

export default function FeaturesPage() {
    const router = useRouter();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Permissions Overview</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <RoleFeatures />
        </div>
    );
}