"use client";

import { permissionEngine } from "@/hooks/engine/permission.engine";

export function RoleGuard({
    roles,
    children,
}: {
    roles: string[];
    children: React.ReactNode;
}) {
    if (!permissionEngine.hasRole(roles)) {
        return <div>403 Forbidden</div>;
    }

    return <>{children}</>;
}