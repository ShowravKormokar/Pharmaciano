import { api } from "../lib/api";
import { ProfileApiResponse } from "@/types/auth";

export interface LoginPayload {
    email: string;
    password: string;
}

export const loginService = async (payload: LoginPayload) => {
    const res = await api.post("/v1/auth/login", payload);
    return res.data; // { success, message, data: { token, user } }
};

export const fetchProfileService = async (): Promise<ProfileApiResponse> => {
    const res = await api.get<ProfileApiResponse>("/v1/users/profile");
    return res.data;
};