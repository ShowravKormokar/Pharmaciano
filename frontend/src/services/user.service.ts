import { api } from "@/lib/api";
import type { UsersApiResponse } from "@/types/user";
import type { MutationApiResponse } from "@/types/response";

export const fetchUsersService = async (): Promise<UsersApiResponse> => {
    const res = await api.get<UsersApiResponse>("/v1/users");
    return res.data;
};

export const createUserService = async (data: {
    email: string;
    password: string;
    name: string;
    role: string;
    orgName: string;
    branchName: string;
    isActive: boolean;
    phone?: string;
    warehouseName?: string;
}): Promise<MutationApiResponse> => {
    const res = await api.post<MutationApiResponse>("/v1/users", data);
    return res.data;
};

export const updateUserService = async (
    id: string,
    data: {
        email: string;
        password?: string;
        name: string;
        role: string;
        orgName: string;
        branchName: string;
        isActive?: boolean;
        phone?: string;
        warehouseName?: string;
    }
): Promise<MutationApiResponse> => {
    const res = await api.put<MutationApiResponse>(`/v1/users/${id}`, data);
    return res.data;
};

export const deleteUserService = async (id: string): Promise<MutationApiResponse> => {
    const res = await api.delete<MutationApiResponse>(`/v1/users/${id}`);
    return res.data;
};