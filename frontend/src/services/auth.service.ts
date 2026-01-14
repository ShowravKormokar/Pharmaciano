import { api } from "../lib/api";

export interface LoginPayload {
    email: string;
    password: string;
}

export const loginService = async (payload: LoginPayload) => {
    const response = await api.post("/v1/auth/login", payload);
    // console.log("LOGIN SERVICE RESPONSE:", response);
    return response.data;
};