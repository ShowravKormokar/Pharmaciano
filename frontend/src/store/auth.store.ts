import { create } from "zustand";
import type { UserProfile } from "@/types/auth";

interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    setUser: (user: UserProfile) => void;
    clearAuth: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: true,
        }),

    clearAuth: () => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("accessToken");
        cookieStore.delete("auth-token");
        document.cookie = "auth-token=; Max-Age=0; path=/";
        set({ user: null, isAuthenticated: false });
    },

    logout: () => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("accessToken");
        cookieStore.delete("auth-token");
        document.cookie = "auth-token=; Max-Age=0; path=/";
        set({ user: null, isAuthenticated: false });
    }
}));