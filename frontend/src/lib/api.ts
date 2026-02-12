import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token automatically (RAW token, not Bearer)
api.interceptors.request.use((config) => {
    const token =
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("accessToken");

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = token; // ✅ backend expects raw token
    }

    return config;
});