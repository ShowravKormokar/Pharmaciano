import { NavItem } from "@/constants/navigation";
import { UserRoleEnum } from "@/types/roles";
import { hasPermission } from "@/lib/permission-utils";

export const filterNavigationByPermission = (
    navigation: NavItem[],
    user: any
): NavItem[] => {
    if (!user) return [];

    const userPermissions = user.roleId?.permissions || [];
    const userRole = user.roleId?.name;

    // console.log("User Role:", userRole);
    // console.log("User Permissions:", userPermissions);

    // 🚀 SUPER ADMIN - Show all navigation without check any permission
    if (userRole === UserRoleEnum.SUPER_ADMIN) {
        // console.log("🚀 Super Admin: Showing ALL navigation without any permission check");
        return navigation; // Return all navigation items for Super Admin without filtering
    }

    if (userRole === UserRoleEnum.SUPER_ADMIN) {
        // console.log("Super Admin: Showing all navigation items");//For debugging
        return navigation.map(item => ({
            ...item,
            children: item.children // Show all children for Super Admin
        }));
    }

    const hasRequiredPermission = (permission?: string) => {
        if (!permission) return true;

        // Use the imported hasPermission function to check permissions
        return hasPermission(userPermissions, permission);
    };

    const hasRequiredRole = (roles?: UserRoleEnum[]) => {
        if (!roles || roles.length === 0) return true;
        return roles.includes(userRole as UserRoleEnum);
    };

    const filteredNav = navigation
        .filter((item) => hasRequiredRole(item.roles))
        .map((item) => {
            if (!item.children) return item;

            const filteredChildren = item.children.filter(
                (child) =>
                    hasRequiredPermission(child.permission) &&
                    hasRequiredRole(child.roles)
            );

            console.log(`Item ${item.label}:`, {
                totalChildren: item.children.length,
                filteredChildren: filteredChildren.length,
                children: filteredChildren.map(c => c.label)
            });

            return {
                ...item,
                children: filteredChildren,
            };
        })
        .filter((item) => {
            if (item.children) return item.children.length > 0;
            return hasRequiredPermission(item.permission);
        });

    // console.log("Final Filtered Navigation:", filteredNav.map(n => n.label));
    return filteredNav;
};