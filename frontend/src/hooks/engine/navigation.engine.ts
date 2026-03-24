/**
 * navigation.engine.ts — Permission-filtered navigation
 *
 * Returns only the nav items the current user can see.
 * Returns [] while auth is loading to avoid flash of hidden items.
 */

import { NavItem } from "@/constants/navigation";
import { rbac } from "@/lib/rbac";
import { useAuthStore } from "@/store/auth.store";

export function filterNavigationByPermission(navigation: NavItem[]): NavItem[] {
    const { loading } = useAuthStore.getState();

    // Don't render nav while auth is hydrating
    if (loading) return [];

    if (rbac.isSuperAdmin()) return navigation;
 
    return navigation
        .filter((item) => {
            if (item.id && !rbac.canAccessModule(item.id)) return false;
            return true;
        })
        .map((item) => {
            if (!item.children) return item;

            const filteredChildren = item.children.filter((child) => {
                if (!child.permission) return true;
                return rbac.hasPermission(child.permission);
            });

            return { ...item, children: filteredChildren };
        })
        .filter((item) => {
            if (item.children) return item.children.length > 0;
            return true;
        });
}