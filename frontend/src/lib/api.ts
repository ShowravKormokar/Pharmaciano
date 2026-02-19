import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Safe token usage
// Only attach token on client side
if (typeof window !== "undefined") {
    api.interceptors.request.use((config) => {
        const token =
            sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");

        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = token; // backend expects raw token
        }

        return config;
    });
}
