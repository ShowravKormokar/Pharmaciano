"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const initializeAuth = useAuthStore((s) => s.initializeAuth);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return <>{children}</>;
}