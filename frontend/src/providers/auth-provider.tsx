"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { fetchProfileService } from "@/services/auth.service";
import type { UserProfile } from "@/types/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const setUser = useAuthStore((s) => s.setUser);

    useEffect(() => {
        const initializeAuth = async () => {
            const token =
                localStorage.getItem("accessToken") ||
                sessionStorage.getItem("accessToken");

            if (!token) return;

            try {
                const profileResponse = await fetchProfileService();
                const profile: UserProfile = profileResponse.data.profile;

                setUser(profile);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        initializeAuth();
    }, [setUser]);

    return <>{children}</>;
};