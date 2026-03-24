"use client";

/**
 * PermissionGuard.tsx — Route-level access control
 *
 * Place in Next.js layout files to protect entire route segments.
 *
 * THE FIX for all 3 cases:
 * ──────────────────────────────────────────────────────────────────
 * Original bug: the guard evaluated permissions BEFORE auth finished
 * loading. Since `user` is null during hydration, every check returned
 * false → redirected authorized users, let through unauthorized users
 * on first render.
 *
 * Fix: three-state logic using rbac.evaluate():
 *   null  (loading)  → show skeleton, make NO redirect decision
 *   false (denied)   → render null, fire redirect in useEffect
 *   true  (allowed)  → render children
 *
 * This guarantees the guard never acts on stale (null) auth state.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { rbac, type AccessConfig } from "@/lib/rbac";
import { useAuthStore } from "@/store/auth.store";

interface PermissionGuardProps extends AccessConfig {
    children: React.ReactNode;
    /** Custom redirect path. Defaults to /dashboard/unauthorized */
    redirectTo?: string;
    /** Custom loading UI. Defaults to skeleton. */
    loadingFallback?: React.ReactNode;
}

export function PermissionGuard({
    children,
    redirectTo = "/dashboard/unauthorized",
    loadingFallback,
    ...accessConfig
}: PermissionGuardProps) {
    const router = useRouter();

    // Re-render whenever auth state changes (loading, user, isAuthenticated)
    const loading = useAuthStore((s) => s.loading);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const user = useAuthStore((s) => s.user);

    const access = rbac.evaluate(accessConfig);

    useEffect(() => {
        // Only redirect once we have a definitive "denied" answer
        if (access === false) {
            router.replace(redirectTo);
        }
    }, [access, redirectTo, router]);

    // Auth still hydrating → show skeleton, never redirect
    if (access === null) {
        return <>{loadingFallback ?? <GuardSkeleton />}</>;
    }

    // Denied → render nothing while redirect fires
    if (access === false) return null;

    // Allowed
    return <>{children}</>;
}

function GuardSkeleton() {
    return (
        <div className="flex flex-col gap-4 p-6 animate-pulse" role="status" aria-label="Loading">
            <div className="h-8 w-48 rounded-md bg-muted" />
            <div className="h-4 w-full rounded-md bg-muted" />
            <div className="h-4 w-3/4 rounded-md bg-muted" />
            <div className="h-64 w-full rounded-md bg-muted" />
        </div>
    );
};