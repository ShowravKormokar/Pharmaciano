import { create } from "zustand";
import type { UserProfile } from "@/types/auth";
import { fetchProfileService } from "@/services/auth.service";

// ─── Profile Cache Helpers ────────────────────────────────────────────────────

const PROFILE_CACHE_KEY = "user_profile_cache";
const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedProfile {
    profile: UserProfile;
    cachedAt: number;
}

export function setCachedProfile(profile: UserProfile, persistent: boolean): void {
    try {
        const payload: CachedProfile = { profile, cachedAt: Date.now() };
        const serialized = JSON.stringify(payload);
        if (persistent) {
            localStorage.setItem(PROFILE_CACHE_KEY, serialized);
        } else {
            sessionStorage.setItem(PROFILE_CACHE_KEY, serialized);
        }
    } catch {
        // Storage quota or serialization error — not fatal
    }
}

function getCachedProfile(): UserProfile | null {
    try {
        const raw =
            sessionStorage.getItem(PROFILE_CACHE_KEY) ||
            localStorage.getItem(PROFILE_CACHE_KEY);
        if (!raw) return null;

        const cached: CachedProfile = JSON.parse(raw);
        const isExpired = Date.now() - cached.cachedAt > PROFILE_CACHE_TTL_MS;
        return isExpired ? null : cached.profile;
    } catch {
        return null;
    }
}

export function clearCachedProfile(): void {
    sessionStorage.removeItem(PROFILE_CACHE_KEY);
    localStorage.removeItem(PROFILE_CACHE_KEY);
}

// ─── Auth Store ───────────────────────────────────────────────────────────────

interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    loading: boolean;

    setUser: (user: UserProfile) => void;
    initializeAuth: () => Promise<void>;
    logout: () => void;
}

// ─── Sync initial state from cache ───────────────────────────────────────────
const getInitialAuthState = (): Pick<AuthState, "user" | "isAuthenticated" | "loading"> => {
    try {
        const token =
            sessionStorage.getItem("accessToken") ||
            localStorage.getItem("accessToken");

        if (!token) return { user: null, isAuthenticated: false, loading: false };

        const cached = getCachedProfile(); // your existing helper
        if (cached) {
            return { user: cached, isAuthenticated: true, loading: false };
        }
    } catch {
        // SSR or storage unavailable
    }
    return { user: null, isAuthenticated: false, loading: true };
};

// ─── Auth Store ───────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>((set) => ({
    ...getInitialAuthState(), // ← hydrated synchronously, zero flash

    setUser: (user) => set({ user, isAuthenticated: true, loading: false }),

    initializeAuth: async () => {
        const isPersistent = !!localStorage.getItem("accessToken");
        const token =
            sessionStorage.getItem("accessToken") ||
            localStorage.getItem("accessToken");

        if (!token) {
            set({ user: null, isAuthenticated: false, loading: false });
            return;
        }

        const cached = getCachedProfile();
        if (cached) {
            // Already hydrated at creation — just revalidate in background
            fetchProfileService()
                .then((res) => {
                    const profile = res.data.profile;
                    setCachedProfile(profile, isPersistent);
                    set({ user: profile, isAuthenticated: true });
                })
                .catch(() => {
                    clearCachedProfile();
                    sessionStorage.removeItem("accessToken");
                    localStorage.removeItem("accessToken");
                    document.cookie = "auth-token=; Max-Age=0; path=/";
                    set({ user: null, isAuthenticated: false, loading: false });
                });
            return;
        }

        // No cache — must await fresh fetch
        try {
            const res = await fetchProfileService();
            const profile = res.data.profile;
            setCachedProfile(profile, isPersistent);
            set({ user: profile, isAuthenticated: true, loading: false });
        } catch {
            sessionStorage.removeItem("accessToken");
            localStorage.removeItem("accessToken");
            set({ user: null, isAuthenticated: false, loading: false });
        }
    },

    logout: () => {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("accessToken");
        clearCachedProfile();
        document.cookie = "auth-token=; Max-Age=0; path=/";
        set({ user: null, isAuthenticated: false, loading: false });
    },
}));