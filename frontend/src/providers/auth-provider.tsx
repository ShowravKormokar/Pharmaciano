"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const initializeAuth = useAuthStore((s) => s.initializeAuth);

    // duplicate execution (Strict Mode safe)
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        initializeAuth();

        try {
            const sessionToken = sessionStorage.getItem("accessToken");
            const localToken = localStorage.getItem("accessToken");
            const token = sessionToken || localToken;

            const hasCookie = document.cookie
                .split("; ")
                .some((row) => row.startsWith("auth-token="));

            if (hasCookie && !token) {
                document.cookie = "auth-token=; Max-Age=0; path=/";
            }
        } catch {
            // silently ignore (SSR safety / browser quirks)
        }
    }, [initializeAuth]);

    return <>{children}</>;
}