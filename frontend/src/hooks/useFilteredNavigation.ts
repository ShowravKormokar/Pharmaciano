"use client";

import { useEffect, useMemo, useState } from "react";
import { navigation, NavItem } from "@/constants/navigation";
import { filterNavigationByPermission } from "@/hooks/engine/navigation.engine";
import { useAuthStore } from "@/store/auth.store";

export function useFilteredNavigation() {
    const { user, loading } = useAuthStore();

    const authReady = !loading && !!user;

    const [cachedNavigation, setCachedNavigation] = useState<NavItem[] | null>(null);

    const filteredNavigation = useMemo(() => {
        if (!authReady) return null;
        return filterNavigationByPermission(navigation);
    }, [authReady]);

    // ✅ cache once auth is ready
    useEffect(() => {
        if (filteredNavigation) {
            setCachedNavigation(filteredNavigation);
        }
    }, [filteredNavigation]);

    const showSkeleton = !cachedNavigation || cachedNavigation.length === 1;

    return {
        navigation: cachedNavigation ?? [],
        showSkeleton,
        authReady,
    };
}