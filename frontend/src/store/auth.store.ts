import { create } from "zustand";

interface AuthState {
    user: any | null;
    isAuthenticated: boolean;
    setUser: (user: any) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) =>
        set({ user, isAuthenticated: true }),

    logout: () => {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie = "auth-token=; Max-Age=0; path=/";
        set({ user: null, isAuthenticated: false });
    },
}));