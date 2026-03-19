import { api } from "../lib/api";
import type { ProfileApiResponse, LoginPayload, LoginApiResponse } from "@/types/auth";

export const loginService = async (payload: LoginPayload) => {
    // Axios wraps the response in res.data, so res.data = { success, message, data: { token, user } }
    const res = await api.post("/v1/auth/login", payload);
    return res; // return the full axios response
};

export const fetchProfileService = async (): Promise<ProfileApiResponse> => {
    const res = await api.get<ProfileApiResponse>("/v1/users/profile");
    return res.data;
};