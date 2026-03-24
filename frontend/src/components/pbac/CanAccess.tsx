"use client";

/**
 * CanAccess.tsx — UI-level access control
 *
 * Does NOT redirect. Purely shows/hides/replaces UI elements
 * based on the current user's permissions and roles.
 *
 * Unlike PermissionGuard (route-level), this is for individual
 * buttons, links, panels, and sections within a page.
 *
 * @example — Hide entirely (renders nothing if denied)
 * <CanAccess permission="user:create">
 *   <CreateUserButton />
 * </CanAccess>
 *
 * @example — Show disabled fallback when denied
 * <CanAccess permission="user:delete" fallback={<Button disabled>Delete</Button>}>
 *   <Button onClick={handleDelete}>Delete</Button>
 * </CanAccess>
 *
 * @example — Require ALL permissions
 * <CanAccess allOf={["user:update", "user:delete"]}>
 *   <BulkActions />
 * </CanAccess>
 *
 * @example — Require ANY permission
 * <CanAccess anyOf={["sales:read", "reports:view"]}>
 *   <SalesLink />
 * </CanAccess>
 *
 * @example — By role
 * <CanAccess roles={["SUPER_ADMIN", "MANAGER"]}>
 *   <AdminPanel />
 * </CanAccess>
 *
 * @example — Whole module
 * <CanAccess module="accounting">
 *   <AccountingNav />
 * </CanAccess>
 *
 * @example — Combine checks (all must pass)
 * <CanAccess module="sales" anyOf={["sales:create", "sales:process"]}>
 *   <NewSaleButton />
 * </CanAccess>
 */

import type { ReactNode } from "react";
import { rbac, type AccessConfig } from "@/lib/rbac";
import { useAuthStore } from "@/store/auth.store";
import { ShieldX } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface CanAccessProps extends AccessConfig {
    children: ReactNode;
    /**
     * Rendered when access is denied.
     * Omit to hide entirely (renders null).
     */
    fallback?: ReactNode;
    /**
     * Rendered while auth is still loading.
     * Omit to render nothing during hydration (safest default).
     */
    loadingFallback?: ReactNode;
}

export function CanAccess({
    children,
    fallback = null,
    loadingFallback = null,
    ...accessConfig
}: CanAccessProps) {
    // Subscribe to auth changes so CanAccess re-evaluates when user loads
    const loading = useAuthStore((s) => s.loading);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const user = useAuthStore((s) => s.user);

    const access = rbac.evaluate(accessConfig);

    if (access === null) return <>{loadingFallback}</>;
    if (access === false) return <><div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center px-4">
        <ShieldX className="h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground max-w-md">
            You don't have permission to view this page. Contact your administrator
            if you believe this is a mistake.
        </p>
        <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
    </div></>;
    return <>{children}</>;
}
