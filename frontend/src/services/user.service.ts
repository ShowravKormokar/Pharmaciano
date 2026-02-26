import { api } from "@/lib/api";
import type { UsersApiResponse, UserItem } from "@/types/user";

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
}) => {
    const res = await api.post("/v1/users", data);
    return res.data;
};

export const updateUserService = async (
    id: string,
    data: {
        email: string;
        password?: string; // optional for update
        name: string;
        role: string;
        orgName: string;
        branchName: string;
        isActive?: boolean;
        phone?: string;
        warehouseName?: string;
    }
) => {
    const res = await api.put(`/v1/users/${id}`, data);
    return res.data;
};

export const deleteUserService = async (id: string) => {
    const res = await api.delete(`/v1/users/${id}`);
    return res.data;
};