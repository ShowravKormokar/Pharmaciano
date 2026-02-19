import { useAuthStore } from "@/store/auth.store";

class RBAC {
    private getUser() {
        return useAuthStore.getState().user;
    }

    private getRole() {
        return this.getUser()?.roleId?.name || null;
    }

    private getPermissions(): string[] {
        return this.getUser()?.roleId?.permissions || [];
    }

    /* ========================= */
    /* ===== SUPER ADMIN ======= */
    /* ========================= */

    isSuperAdmin(): boolean {
        const user = this.getUser();
        return user?.roleId?.name === "SUPER_ADMIN";
    }


    /* ========================= */
    /* ===== ROLE CHECK ======== */
    /* ========================= */

    hasRole(roles: string | string[]): boolean {
        if (this.isSuperAdmin()) return true;

        const role = this.getRole();
        if (!role) return false;

        const allowed = Array.isArray(roles) ? roles : [roles];
        return allowed.includes(role);
    }

    /* ========================= */
    /* ===== PERMISSION CHECK == */
    /* ========================= */

    hasPermission(permission: string): boolean {
        if (this.isSuperAdmin()) return true;

        const permissions = this.getPermissions();

        const [module] = permission.split(":");

        // If user has module:manage → allow everything under module
        if (permissions.includes(`${module}:manage`)) {
            return true;
        }

        return permissions.includes(permission);
    }

    hasAny(permissionList: string[]): boolean {
        return permissionList.some((p) => this.hasPermission(p));
    }

    /* ========================= */
    /* ===== MODULE ACCESS ===== */
    /* ========================= */

    canAccessModule(module: string): boolean {
        if (this.isSuperAdmin()) return true;

        const permissions = this.getPermissions();

        return permissions.some((p) => p.startsWith(module + ":"));
    }
}

export const rbac = new RBAC();