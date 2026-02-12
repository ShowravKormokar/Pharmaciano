import { permissionEngine } from "./permission.engine";
import { NavItem } from "@/constants/navigation";

export function filterNavigationByPermission(nav: NavItem[]): NavItem[] {
    return nav
        .map((item) => {
            if (item.children) {
                const filteredChildren = item.children.filter((child) => {
                    if (!child.permission) return true; // public route
                    return permissionEngine.can(child.permission);
                });

                if (filteredChildren.length === 0) return null;

                return { ...item, children: filteredChildren };
            }

            if (item.permission) {
                return permissionEngine.can(item.permission) ? item : null;
            }

            return item;
        })
        .filter(Boolean) as NavItem[];
}
