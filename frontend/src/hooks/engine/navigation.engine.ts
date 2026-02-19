import { NavItem } from "@/constants/navigation";
import { rbac } from "@/lib/rbac";

export const filterNavigationByPermission = (
    navigation: NavItem[]
): NavItem[] => {

    if (rbac.isSuperAdmin()) {
        return navigation; // show everything
    }

    return navigation
        .filter((item) => {

            // If module id exists, check module access
            if (item.id && !rbac.canAccessModule(item.id)) {
                return false;
            }

            return true;
        })
        .map((item) => {
            if (!item.children) return item;

            const filteredChildren = item.children.filter((child) => {
                if (!child.permission) return true;
                return rbac.hasPermission(child.permission);
            });

            return {
                ...item,
                children: filteredChildren,
            };
        })
        .filter((item) => {
            if (item.children) return item.children.length > 0;
            return true;
        });
};
