"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { permissionEngine } from "@/hooks/engine/permission.engine";

export function RouteGuard({
    permission,
    children,
}: {
    permission: string;
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        if (!permissionEngine.can(permission)) {
            router.replace("/dashboard");
        }
    }, [permission, router]);

    return <>{children}</>;
}