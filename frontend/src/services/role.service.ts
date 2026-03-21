import { api } from "@/lib/api";
import type {
    RoleItem,
    FeatureItem,
    RolesApiResponse,
    FeaturesApiResponse,
    GetRoleResponse,
} from "@/types/role";
import type { MutationApiResponse } from "@/types/response";

export const fetchRolesService = async (): Promise<RoleItem[]> => {
    const res = await api.get<RolesApiResponse>("/v1/roles");
    return res.data.data.roles;
};

export const fetchRoleByIdService = async (id: string): Promise<RoleItem> => {
    const res = await api.get<GetRoleResponse>(`/v1/roles/${id}`);
    return res.data.data.role;
};

export const createRoleService = async (data: {
    name: string;
    description: string;
    permissions: string[];
    isActive: boolean;
}): Promise<{ data: MutationApiResponse }> => {
    const res = await api.post<MutationApiResponse>("/v1/roles", data);
    return { data: res.data };
};

export const updateRoleService = async (
    id: string,
    data: {
        name: string;
        description: string;
        permissions: string[];
        isActive: boolean;
    }
): Promise<{ data: MutationApiResponse }> => {
    const res = await api.put<MutationApiResponse>(`/v1/roles/${id}`, data);
    return { data: res.data };
};

export const deleteRoleService = async (id: string): Promise<{ data: MutationApiResponse }> => {
    const res = await api.delete<MutationApiResponse>(`/v1/roles/${id}`);
    return { data: res.data };
};

export const fetchFeaturesService = async (): Promise<FeatureItem[]> => {
    const res = await api.get<FeaturesApiResponse>("/v1/roles/features");
    return res.data.data.features;
};