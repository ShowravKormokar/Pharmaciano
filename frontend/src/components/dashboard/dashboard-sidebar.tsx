"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, NavItem } from "@/constants/navigation";
import { filterNavigationByPermission } from "@/hooks/engine/navigation.engine";
import { useAuthStore } from "@/store/auth.store";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LogoutButton } from "./logout-button";
import { isRouteActive, getBestMatch, normalizePath } from "@/utils/route-matcher";
import { PermissionLink } from "../pbac/PermissionLink";
import { useFilteredNavigation } from "@/hooks/useFilteredNavigation";

type IconComponent = React.ElementType;

function SidebarNavItem({
    item,
    isOpen,
    toggleOpen,
    pathname,
    authReady,
}: {
    item: NavItem;
    isOpen: boolean;
    toggleOpen: (id: string) => void;
    pathname: string;
    authReady: boolean;
}) {
    const Icon = item.icon as IconComponent | undefined;

    const hasChildren =
        Array.isArray(item.children) && item.children.length > 0;

    const visibleChildren = useMemo(() => {
        if (!hasChildren) return [];
        return item.children!;
    }, [item.children, hasChildren]);

    if (hasChildren && visibleChildren.length === 0) return null;

    //bestChildMatch returns the single most-specific href that matches
    // the current pathname — used for both parentActive and childActive.
    const bestChildMatch = hasChildren
        ? getBestMatch(
            pathname,
            visibleChildren
                .map((c) => c.href)
                .filter(Boolean) as string[]
        )
        : null;

    const parentActive =
        item.href
            ? isRouteActive(pathname, item.href)
            : !!bestChildMatch; // parent is active only when a child matches

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild={hasChildren}
                onClick={() => hasChildren && toggleOpen(item.id || item.label)}
                aria-expanded={hasChildren ? isOpen : undefined}
                aria-controls={
                    hasChildren ? `submenu-${item.id || item.label}` : undefined
                }
                className="flex items-center justify-between w-full"
                isActive={parentActive}
            >
                {hasChildren ? (
                    <div className="flex items-center gap-3 w-full text-left">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                        <span className="ml-auto text-xs opacity-60">
                            {isOpen ? "−" : "+"}
                        </span>
                    </div>
                ) : (
                    <Link
                        href={item.href ?? "#"}
                        className="flex items-center gap-3 w-full"
                    >
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                    </Link>
                )}
            </SidebarMenuButton>

            {hasChildren && isOpen && (
                <nav
                    id={`submenu-${item.id || item.label}`}
                    className="ml-6 mt-2 flex flex-col space-y-2"
                >
                    {visibleChildren.map((child) => {
                        const ChildIcon =
                            child.icon as IconComponent | undefined;

                        const childActive = bestChildMatch === child.href;

                        return (
                            <SidebarMenuItem key={child.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={childActive}
                                >
                                    {authReady && child.permission ? (
                                        <PermissionLink
                                            href={child.href}
                                            permission={child.permission}
                                            className="flex items-center gap-3"
                                        >
                                            {ChildIcon && (
                                                <ChildIcon className="h-4 w-4" />
                                            )}
                                            <span>{child.label}</span>
                                        </PermissionLink>
                                    ) : (
                                        <Link
                                            href={child.href}
                                            className="flex items-center gap-3"
                                        >
                                            {ChildIcon && (
                                                <ChildIcon className="h-4 w-4" />
                                            )}
                                            <span>{child.label}</span>
                                        </Link>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </nav>
            )}
        </SidebarMenuItem>
    );
}

export function DashboardSidebar() {
    const pathname = usePathname();
    const { user, loading, navigation } = useAuthStore();

    const authReady = !loading && !!user;
    const showSkeleton = loading || !navigation || navigation.length === 1;

    const defaultOpenId = useMemo(() => {
        if (!navigation.length) return null;

        const found = navigation.find(
            (n) =>
                n.children &&
                getBestMatch(
                    pathname,
                    n.children.map((c) => c.href)
                )
        );

        return found?.id ?? null;
    }, [pathname, navigation]);

    const [open, setOpen] = useState<string | null>(defaultOpenId);

    const toggleOpen = (id: string) =>
        setOpen((prev) => (prev === id ? null : id));

    return (
        <Sidebar>
            <SidebarContent className="hide-scrollbar">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg font-bold p-6 border-2 mb-2">
                        <span className="mr-2 text-xl">💊</span>
                        Pharmaciano
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {showSkeleton ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <SidebarMenuItem key={i}>
                                        <div className="h-8 rounded-md bg-muted animate-pulse mx-2" />
                                    </SidebarMenuItem>
                                ))
                            ) : (
                                navigation.map((item) => (
                                    <SidebarNavItem
                                        key={item.id ?? item.label}
                                        item={item}
                                        isOpen={open === (item.id ?? item.label)}
                                        toggleOpen={toggleOpen}
                                        pathname={pathname}
                                        authReady={authReady}
                                    />
                                ))
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <div className="mt-auto border-t px-4 py-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col leading-tight">
                        <span className="text-xs font-medium text-muted-foreground">
                            Logged in as
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                            {authReady
                                ? user?.name || user?.email || "User"
                                : "—"}
                        </span>
                    </div>
                    <div className="shrink-0">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}