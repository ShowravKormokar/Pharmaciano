import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    config.headers = config.headers ?? {};
    if (token) {
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
});