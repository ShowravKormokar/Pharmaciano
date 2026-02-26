import { api } from "@/lib/api";
import type {
    RoleItem,
    FeatureItem,
    RolesApiResponse,
    FeaturesApiResponse,
    GetRoleResponse,
} from "@/types/role";

/* =========================
   Get All Roles
========================= */
export const fetchRolesService = async (): Promise<RoleItem[]> => {
    const res = await api.get<RolesApiResponse>("/v1/roles");
    return res.data.data.roles;
};

/* =========================
   Get Role by ID: Doesn't exist yet, but can be implemented if needed for direct role fetching (e.g. for edit page without pre-filled data)
========================= */
// export const fetchRoleByIdService = async (
//     id: string
// ): Promise<RoleItem> => {
//     const res = await api.get<GetRoleResponse>(`/v1/roles/${id}`);
//     return res.data.data;
// };

/* =========================
   Create Role
========================= */
export const createRoleService = async (data: {
    name: string;
    description: string;
    permissions: string[];
    isActive: boolean;
}) => {
    return await api.post("/v1/roles", data);
};

/* =========================
   Update Role
========================= */
export const updateRoleService = async (
    id: string,
    data: {
        name: string;
        description: string;
        permissions: string[];
        isActive: boolean;
    }
) => {
    return await api.put(`/v1/roles/${id}`, data);
};

/* =========================
   Delete Role
========================= */
export const deleteRoleService = async (id: string) => {
    return await api.delete(`/v1/roles/${id}`);
};

/* =========================
   Get Features
========================= */
export const fetchFeaturesService = async (): Promise<FeatureItem[]> => {
    const res = await api.get<FeaturesApiResponse>("/v1/roles/features");
    return res.data.data.features;
};