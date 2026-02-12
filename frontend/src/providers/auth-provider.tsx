"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const initializeAuth = useAuthStore((s) => s.initializeAuth);

    useEffect(() => {
        // Initialize store state
        initializeAuth();

        // Retrieve tokens
        const sessionToken = sessionStorage.getItem("accessToken");
        const localToken = localStorage.getItem("accessToken");
        const token = sessionToken || localToken;

        // Check cookie
        const cookieToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth-token="));

        // If cookie exists but no valid token in storage → clear cookie
        if (cookieToken && !token) {
            document.cookie = "auth-token=; Max-Age=0; path=/";
        }
    }, [initializeAuth]);

    return <>{children}</>;
}
