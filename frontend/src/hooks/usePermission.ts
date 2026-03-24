"use client";

/**
 * usePermission.ts — Imperative permission checks inside component logic
 *
 * Use this when you need permission checks in:
 * - event handlers
 * - conditional rendering via JS (not JSX)
 * - data-fetching effects
 * - computed values
 *
 * @example
 * const { can, loading } = usePermission();
 *
 * // Inside render
 * const columns = can("user:delete") ? [...baseColumns, deleteCol] : baseColumns;
 *
 * // Inside handler
 * function handleExport() {
 *   if (!can("reports:view")) return toast.error("No permission");
 *   exportReport();
 * }
 *
 * // Chained checksm
 * can.allOf(["user:update", "user:delete"])
 * can.anyOf(["sales:read", "reports:view"])
 * can.module("accounting")
 * can.role(["SUPER_ADMIN", "MANAGER"])
 * can.superAdmin()
 */

import { useAuthStore } from "@/store/auth.store";
import { rbac } from "@/lib/rbac";

export function usePermission() {
    // Subscribe so the hook re-runs when auth state changes
    const { loading, isAuthenticated } = useAuthStore();

    function can(permission: string): boolean {
        if (loading || !isAuthenticated) return false;
        return rbac.hasPermission(permission);
    }

    can.allOf = (permissions: string[]): boolean => {
        if (loading || !isAuthenticated) return false;
        return rbac.hasAll(permissions);
    };

    can.anyOf = (permissions: string[]): boolean => {
        if (loading || !isAuthenticated) return false;
        return rbac.hasAny(permissions);
    };

    can.module = (module: string): boolean => {
        if (loading || !isAuthenticated) return false;
        return rbac.canAccessModule(module);
    };

    can.role = (roles: string | string[]): boolean => {
        if (loading || !isAuthenticated) return false;
        return rbac.hasRole(roles);
    };

    can.superAdmin = (): boolean => {
        if (loading || !isAuthenticated) return false;
        return rbac.isSuperAdmin();
    };

    return {
        can,
        loading,
        isAuthenticated,
    };
};