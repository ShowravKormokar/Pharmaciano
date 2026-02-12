import { api } from "../lib/api";
import type { ProfileApiResponse, LoginPayload, LoginApiResponse } from "@/types/auth";

export const loginService = async (payload: LoginPayload): Promise<LoginApiResponse> => {
    const res = await api.post<LoginApiResponse>("/v1/auth/login", payload);
    return res.data; // type-safe now
};

export const fetchProfileService = async (): Promise<ProfileApiResponse> => {
    const res = await api.get<ProfileApiResponse>("/v1/users/profile");
    return res.data;
};