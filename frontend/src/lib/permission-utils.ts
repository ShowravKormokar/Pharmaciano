/**
 * Permission utility functions for role-based access control
 */

type Permission = string;

/**
 * Checks if user has any of the required permissions
 * @param userPermissions - User's current permissions
 * @param requiredPermissions - Required permissions for access
 * @returns boolean
 */
export const hasAnyPermission = (
    userPermissions: Permission[],
    requiredPermissions: Permission[]
): boolean => {
    if (!requiredPermissions.length) return true;
    if (!userPermissions.length) return false;

    // Expand manage permissions to include all related permissions
    const expandedPermissions = userPermissions.flatMap(p => {
        if (p.endsWith(':manage')) {
            const base = p.replace(':manage', '');
            return [
                p,                           // resource:manage
                `${base}:read`,               // resource:read
                `${base}:create`,              // resource:create
                `${base}:update`,              // resource:update
                `${base}:delete`,              // resource:delete
                `${base}:view`,                // resource:view (alternative)
                `${base}:list`,                 // resource:list (alternative)
                `${base}:process`,              // resource:process (for sales)
                `${base}:return`,               // resource:return (for returns)
                `${base}:adjust`,                // resource:adjust (for inventory)
                `${base}:import`,                // resource:import
                `${base}:export`,                // resource:export
                `${base}:approve`,               // resource:approve
                `${base}:transfer`,               // resource:transfer
                `${base}:predict`,                // resource:predict (for AI)
                `${base}:recommend`               // resource:recommend (for AI)
            ];
        }
        return [p];
    });

    // Remove duplicates
    const uniqueExpandedPermissions = [...new Set(expandedPermissions)];

    // console.log('Expanded Permissions:', uniqueExpandedPermissions);
    // console.log('Required Permissions:', requiredPermissions);

    // Check if any required permission exists in expanded permissions
    return requiredPermissions.some(rp => uniqueExpandedPermissions.includes(rp));
};

/**
 * Checks if user has all required permissions
 * @param userPermissions - User's current permissions
 * @param requiredPermissions - Required permissions for access
 * @returns boolean
 */
export const hasAllPermissions = (
    userPermissions: Permission[],
    requiredPermissions: Permission[]
): boolean => {
    if (!requiredPermissions.length) return true;
    if (!userPermissions.length) return false;

    const expandedPermissions = userPermissions.flatMap(p => {
        if (p.endsWith(':manage')) {
            const base = p.replace(':manage', '');
            return [p, `${base}:read`, `${base}:create`, `${base}:update`, `${base}:delete`];
        }
        return [p];
    });

    const uniqueExpandedPermissions = [...new Set(expandedPermissions)];

    return requiredPermissions.every(rp => uniqueExpandedPermissions.includes(rp));
};

/**
 * Checks if user has a specific permission
 * @param userPermissions - User's current permissions
 * @param requiredPermission - Required permission
 * @returns boolean
 */
export const hasPermission = (
    userPermissions: Permission[],
    requiredPermission: Permission
): boolean => {
    return hasAnyPermission(userPermissions, [requiredPermission]);
};

/**
 * Gets all permissions for a specific resource
 * @param userPermissions - User's current permissions
 * @param resource - Resource name (e.g., 'user', 'inventory', 'sales')
 * @returns Permission[]
 */
export const getResourcePermissions = (
    userPermissions: Permission[],
    resource: string
): Permission[] => {
    return userPermissions.filter(p => p.startsWith(`${resource}:`));
};

/**
 * Check if user can perform action on resource
 * @param userPermissions - User's current permissions
 * @param resource - Resource name
 * @param action - Action to perform
 * @returns boolean
 */
export const can = (
    userPermissions: Permission[],
    resource: string,
    action: string
): boolean => {
    return hasPermission(userPermissions, `${resource}:${action}`);
};