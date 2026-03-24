/**
 * rbac.ts — Core Role-Based Access Control
 *
 * Single source of truth for ALL permission logic.
 * Used by PermissionGuard (route), CanAccess (UI), and usePermission (hook).
 *
 * Architecture note: class-based singleton that reads Zustand state directly.
 * Avoids prop-drilling and keeps permission logic in one place.
 *
 * Why NOT expand manage→subpermissions explicitly (like your old PermissionEngine did)?
 * Because it requires you to keep a hardcoded list of every possible action in sync
 * with your backend. Instead, `module:manage` grants any `module:*` via prefix match.
 */

import { useAuthStore } from "@/store/auth.store";

export interface AccessConfig {
    permission?: string;
    allOf?: string[];
    anyOf?: string[];
    roles?: string[];
    module?: string;
}

class RBAC {
    // ─── Private store accessors ────────────────────────────────────

    private getUser() {
        return useAuthStore.getState().user;
    }

    private getRole(): string | null {
        // Supports both `role.name` and `roleId.name` shapes
        const user = this.getUser();
        return user?.roleId?.name ?? user?.roleId?.name ?? null;
    }

    private getPermissions(): string[] {
        const user = this.getUser();
        return user?.roleId?.permissions ?? user?.roleId?.permissions ?? [];
    }

    // ─── Auth state ─────────────────────────────────────────────────

    isLoading(): boolean {
        return useAuthStore.getState().loading;
    }

    isAuthenticated(): boolean {
        return useAuthStore.getState().isAuthenticated;
    }

    // ─── Super Admin ─────────────────────────────────────────────────

    isSuperAdmin(): boolean {
        return this.getRole() === "SUPER_ADMIN";
    }

    // ─── Role ────────────────────────────────────────────────────────

    /**
     * Returns true if the user's role is one of the given roles.
     * SUPER_ADMIN always passes every role check.
     */
    hasRole(roles: string | string[]): boolean {
        if (this.isSuperAdmin()) return true;
        const role = this.getRole();
        if (!role) return false;
        const allowed = Array.isArray(roles) ? roles : [roles];
        return allowed.includes(role);
    }

    // ─── Permission ──────────────────────────────────────────────────

    /**
     * Checks a single permission string e.g. "user:read".
     *
     * Priority:
     *   1. SUPER_ADMIN → always true
     *   2. `module:manage` in user permissions → true for ANY `module:*`
     *   3. Exact permission match
     */
    hasPermission(permission: string): boolean {
        if (this.isSuperAdmin()) return true;

        const permissions = this.getPermissions();
        if (!permissions.length) return false;

        const sep = permission.indexOf(":");
        if (sep !== -1) {
            const mod = permission.substring(0, sep);
            if (permissions.includes(`${mod}:manage`)) return true;
        }

        return permissions.includes(permission);
    }

    /** User must have ALL listed permissions. */
    hasAll(list: string[]): boolean {
        if (!list.length) return true;
        return list.every((p) => this.hasPermission(p));
    }

    /** User must have AT LEAST ONE of the listed permissions. */
    hasAny(list: string[]): boolean {
        if (!list.length) return true;
        return list.some((p) => this.hasPermission(p));
    }

    // ─── Module ──────────────────────────────────────────────────────

    /**
     * Returns true if user has any permission for the given module.
     * e.g. canAccessModule("user") → true if user has user:read, user:manage, etc.
     */
    canAccessModule(module: string): boolean {
        if (this.isSuperAdmin()) return true;
        const permissions = this.getPermissions();
        return permissions.some((p) => p.startsWith(`${module}:`));
    }

    // ─── Composite evaluator ─────────────────────────────────────────

    /**
     * Evaluates an AccessConfig in one call.
     * Returns:
     *   null  → auth still loading (no decision yet)
     *   true  → access granted
     *   false → access denied
     *
     * Used internally by PermissionGuard and CanAccess.
     */
    evaluate(config: AccessConfig): boolean | null {
        if (this.isLoading()) return null;
        if (!this.isAuthenticated()) return false;
        if (this.isSuperAdmin()) return true;

        if (config.permission && !this.hasPermission(config.permission)) return false;
        if (config.allOf?.length && !this.hasAll(config.allOf)) return false;
        if (config.anyOf?.length && !this.hasAny(config.anyOf)) return false;
        if (config.roles?.length && !this.hasRole(config.roles)) return false;
        if (config.module && !this.canAccessModule(config.module)) return false;

        return true;
    }
}

export const rbac = new RBAC();