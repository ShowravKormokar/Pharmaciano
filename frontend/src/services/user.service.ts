import { api } from "@/lib/api";
import type { UsersApiResponse } from "@/types/user";

export const fetchUsersService = async (): Promise<UsersApiResponse> => {
    const res = await api.get<UsersApiResponse>("/v1/users");
    return res.data;
};