import { api } from "../lib/api";

export interface LoginPayload {
    email: string;
    password: string;
}

export const loginService = async (payload: LoginPayload) => {
    const response = await api.post("/auth/login", payload);
    return response.data;
};