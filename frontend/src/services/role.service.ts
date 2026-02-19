import { api } from "@/lib/api";

export interface RoleItem {
    _id: string;
    name: string;
    description: string;
    permissions: string[];
    isActive: boolean;
}

// Fetch all roles
export const fetchRolesService = async () => {
    const res = await api.get<{ success: boolean; data: { roles: RoleItem[] } }>("/v1/roles");
    return res.data;
};

// Fetch a single role by ID (for edit)
export const fetchRoleByIdService = async (id: string) => {
    const res = await api.get<{ success: boolean; data: RoleItem }>(`/v1/roles/${id}`);
    return res.data;
};

// Delete a role by ID
export const deleteRoleService = async (id: string) => {
    const res = await api.delete(`/v1/roles/${id}`);
    return res.data;
};