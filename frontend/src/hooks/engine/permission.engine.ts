import { useAuthStore } from "@/store/auth.store";

class PermissionEngine {
    private getUser() {
        return useAuthStore.getState().user;
    }

    private getPermissions(): string[] {
        const user = this.getUser();
        return user?.role?.permissions || [];
    }

    private getRole(): string | null {
        const user = this.getUser();
        return user?.role?.name || null;
    }

    hasRole(roles: string | string[]): boolean {
        const role = this.getRole();
        if (!role) return false;

        const allowed = Array.isArray(roles) ? roles : [roles];
        return allowed.includes(role);
    }

    hasPermission(permission: string | string[]): boolean {
        const permissions = this.getPermissions();
        const required = Array.isArray(permission) ? permission : [permission];

        return required.every((p) => permissions.includes(p));
    }

    hasAnyPermission(permission: string[]): boolean {
        const permissions = this.getPermissions();
        return permission.some((p) => permissions.includes(p));
    }

    isSuperAdmin(): boolean {
        return this.getRole() === "Super Admin";
    }

    // ERP-level check (Super Admin override)
    can(permission: string | string[]): boolean {
        if (this.isSuperAdmin()) return true;
        return this.hasPermission(permission);
    }
}

export const permissionEngine = new PermissionEngine();
