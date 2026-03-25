import { create } from "zustand";
import type { UserProfile } from "@/types/auth";
import { fetchProfileService } from "@/services/auth.service";
import { navigation as baseNavigation, type NavItem } from "@/constants/navigation";
import { filterNavigationByPermission } from "@/hooks/engine/navigation.engine";

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
    } catch { }
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

// ─── NEW: Navigation Helper ───────────────────────────────────────────────────

function computeNavigation(user: UserProfile | null): NavItem[] {
    if (!user) return [];
    return filterNavigationByPermission(baseNavigation);
}

// ─── Auth Store ───────────────────────────────────────────────────────────────

interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    loading: boolean;

    navigation: NavItem[]; // ✅ NEW

    setUser: (user: UserProfile) => void;
    initializeAuth: () => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    navigation: [], // ✅ NEW

    setUser: (user) => {
        const nav = computeNavigation(user); // 🔥 compute once

        set({
            user,
            navigation: nav || [],
            isAuthenticated: true,
            loading: false,
        });
    },

    initializeAuth: async () => {
        const isPersistent = !!localStorage.getItem("accessToken");
        const token =
            sessionStorage.getItem("accessToken") ||
            localStorage.getItem("accessToken");

        if (!token) {
            set({
                user: null,
                navigation: [],
                isAuthenticated: false,
                loading: false,
            });
            return;
        }

        // ── Step 1: Instant cache hydration ───────────────
        const cached = getCachedProfile();
        if (cached) {
            const nav = computeNavigation(cached); // 🔥 instant nav

            set({
                user: cached,
                navigation: nav,
                isAuthenticated: true,
                loading: false,
            });

            // ── Step 2: Background revalidation ─────────────
            fetchProfileService()
                .then((res) => {
                    const profile = res.data.profile;

                    setCachedProfile(profile, isPersistent);

                    const updatedNav = computeNavigation(profile); // 🔥 update nav if changed

                    set({
                        user: profile,
                        navigation: updatedNav,
                        isAuthenticated: true,
                    });
                })
                .catch(() => {
                    clearCachedProfile();
                    sessionStorage.removeItem("accessToken");
                    localStorage.removeItem("accessToken");
                    document.cookie = "auth-token=; Max-Age=0; path=/";

                    set({
                        user: null,
                        navigation: [],
                        isAuthenticated: false,
                        loading: false,
                    });
                });

            return;
        }

        // ── Step 3: No cache → fetch ──────────────────────
        try {
            const res = await fetchProfileService();
            const profile = res.data.profile;

            setCachedProfile(profile, isPersistent);

            const nav = computeNavigation(profile); // 🔥 compute once

            set({
                user: profile,
                navigation: nav,
                isAuthenticated: true,
                loading: false,
            });
        } catch (err) {
            console.error("Auth init failed:", err);

            sessionStorage.removeItem("accessToken");
            localStorage.removeItem("accessToken");

            set({
                user: null,
                navigation: [],
                isAuthenticated: false,
                loading: false,
            });
        }
    },

    logout: () => {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("accessToken");
        clearCachedProfile();
        document.cookie = "auth-token=; Max-Age=0; path=/";

        set({
            user: null,
            navigation: [],
            isAuthenticated: false,
            loading: false,
        });
    },
}));