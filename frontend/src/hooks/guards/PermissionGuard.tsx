"use client";

import { permissionEngine } from "@/hooks/engine/permission.engine";

export function PermissionGuard({
    permission,
    children,
}: {
    permission: string | string[];
    children: React.ReactNode;
}) {
    if (!permissionEngine.can(permission)) return null;
    return <>{children}</>;
}