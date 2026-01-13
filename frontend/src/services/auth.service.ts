// import { api } from "../lib/api";

// export interface LoginPayload {
//     email: string;
//     password: string;
// }

// export const loginService = async (payload: LoginPayload) => {
//     const response = await api.post("/login", payload);
//     return response.data;
// };

//For Go Backend
import { api } from "../lib/api";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
}

export const loginService = async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/login", payload);
    return response.data; // This returns {access_token, refresh_token}
};