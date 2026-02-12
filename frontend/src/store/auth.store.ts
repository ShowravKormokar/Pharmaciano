import { create } from "zustand";
import type { UserProfile } from "@/types/auth";
import { fetchProfileService } from "@/services/auth.service";

interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    loading: boolean;

    setUser: (user: UserProfile) => void;
    initializeAuth: () => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: true,
            loading: false,
        }),

    initializeAuth: async () => {
        const token =
            sessionStorage.getItem("accessToken") ||
            localStorage.getItem("accessToken");

        if (!token) {
            set({ user: null, isAuthenticated: false, loading: false });
            return;
        }

        try {
            const res = await fetchProfileService();
            set({
                user: res.data.profile,
                isAuthenticated: true,
                loading: false,
            });
        } catch (err) {
            console.error("Auth init failed:", err);

            sessionStorage.removeItem("accessToken");
            localStorage.removeItem("accessToken");

            set({ user: null, isAuthenticated: false, loading: false });
        }
    },

    logout: () => {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("accessToken");

        document.cookie = "auth-token=; Max-Age=0; path=/";

        set({ user: null, isAuthenticated: false, loading: false });
    },
}));