import { api } from "@/lib/api";
import type {
    RoleItem,
    FeatureItem,
    RolesApiResponse,
    FeaturesApiResponse,
    GetRoleResponse,
} from "@/types/role";
import type { AxiosResponse } from "axios";

/* =========================
   Get All Roles
========================= */
export const fetchRolesService = async (): Promise<RoleItem[]> => {
    const res: AxiosResponse<RolesApiResponse> = await api.get("/v1/roles");
    return res.data.data.roles;
};

/* =========================
   Get Role by ID
========================= */
export const fetchRoleByIdService = async (
    id: string
): Promise<AxiosResponse<GetRoleResponse>> => {
    return await api.get(`/v1/roles/${id}`);
};

/* =========================
   Create Role
========================= */
export const createRoleService = async (data: {
    name: string;
    description: string;
    permissions: string[];
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
    const res: AxiosResponse<FeaturesApiResponse> =
        await api.get("/v1/roles/features");

    return res.data.data.features;
};