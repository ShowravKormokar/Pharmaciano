import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token automatically (local OR session)
api.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});