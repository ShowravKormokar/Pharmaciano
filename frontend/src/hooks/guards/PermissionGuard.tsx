"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { rbac } from "@/lib/rbac";

interface Props {
    permission?: string;
    module?: string;
    children: React.ReactNode;
}

export function PermissionGuard({ permission, module, children }: Props) {
    const router = useRouter();

    useEffect(() => {
        if (permission && !rbac.hasPermission(permission)) {
            router.replace("/dashboard/unauthorized");
        }

        if (module && !rbac.canAccessModule(module)) {
            router.replace("/dashboard/unauthorized");
        }
    }, [permission, module, router]);

    if (permission && !rbac.hasPermission(permission)) return null;
    if (module && !rbac.canAccessModule(module)) return null;

    return <>{children}</>;
};