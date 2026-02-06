"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { fetchProfileService } from "@/services/auth.service";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const setUser = useAuthStore((s) => s.setUser);

    useEffect(() => {
        const initializeAuth = async () => {
            // Check if user has token before fetching profile
            const token = localStorage.getItem("accessToken") ||
                sessionStorage.getItem("accessToken");

            if (!token) {
                console.log("No token found, skipping profile fetch");
                return;
            }

            try {
                const profileResponse = await fetchProfileService();
                const detailedUser = profileResponse.data.profile;

                // Create user object
                const completeUser = {
                    id: detailedUser._id,
                    email: detailedUser.email,
                    name: detailedUser.name,
                    role: detailedUser.role,
                    organization: detailedUser.organization,
                    branch: detailedUser.branch,
                    isActive: detailedUser.isActive,
                    lastLogin: detailedUser.lastLogin,
                };

                // console.log("Setting user from profile:", completeUser);
                setUser(completeUser);

            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        initializeAuth();
    }, [setUser]);

    return <>{children}</>;
}