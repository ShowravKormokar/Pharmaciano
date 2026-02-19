"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, NavItem } from "@/constants/navigation";
import { filterNavigationByPermission } from "@/hooks/engine/navigation.engine";
import { useAuthStore } from "@/store/auth.store";
import { UserRoleEnum } from "@/types/roles";
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

type IconComponent = React.ElementType;

function SidebarNavItem({
    item,
    isOpen,
    toggleOpen,
    pathname,
    isSuperAdmin,
}: {
    item: NavItem;
    isOpen: boolean;
    toggleOpen: (id: string) => void;
    pathname: string;
    isSuperAdmin: boolean;
}) {
    const Icon = item.icon as IconComponent | undefined;
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    const visibleChildren = useMemo(() => {
        if (!hasChildren) return [];
        if (isSuperAdmin) return item.children!; // Super admin show all children without filtering
        return item.children!; // Also showing others, but navigation.engine.ts already filtered
    }, [item.children, hasChildren, isSuperAdmin]);

    if (hasChildren && visibleChildren.length === 0) {
        return null;
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild={hasChildren}
                onClick={() => hasChildren && toggleOpen(item.id || item.label)}
                aria-expanded={hasChildren ? isOpen : undefined}
                aria-controls={hasChildren ? `submenu-${item.id || item.label}` : undefined}
                className="flex items-center justify-between w-full"
                isActive={
                    item.href
                        ? pathname === item.href
                        : hasChildren
                            ? visibleChildren.some((c) => pathname === c.href)
                            : false
                }
            >
                {hasChildren ? (
                    <button type="button" className="flex items-center gap-3 w-full text-left">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                        <span className="ml-auto text-xs opacity-60">{isOpen ? "−" : "+"}</span>
                    </button>
                ) : (
                    <Link href={item.href ?? "#"} className="flex items-center gap-3 w-full">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                    </Link>
                )}
            </SidebarMenuButton>

            {hasChildren && isOpen && (
                <nav id={`submenu-${item.id || item.label}`} className="ml-6 mt-2 flex flex-col space-y-2">
                    {visibleChildren.map((child) => {
                        const ChildIcon = child.icon as IconComponent | undefined;
                        const childActive = pathname === child.href;
                        return (
                            <SidebarMenuItem key={child.href}>
                                <SidebarMenuButton asChild isActive={childActive}>
                                    <Link href={child.href} className="flex items-center gap-3">
                                        {ChildIcon && <ChildIcon className="h-4 w-4" />}
                                        <span>{child.label}</span>
                                    </Link>
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
    const { user } = useAuthStore();

    // Check if user is Super Admin
    const isSuperAdmin = useMemo(() => {
        return user?.roleId?.name === UserRoleEnum.SUPER_ADMIN;
    }, [user]);

    // Filter navigation based on user role
    const filteredNavigation = useMemo(() => {
        if (!user) return [];
        return filterNavigationByPermission(navigation);
    }, [user]);


    // Open default group
    const defaultOpenId = useMemo(() => {
        const found = filteredNavigation.find((n) =>
            n.children?.some((c) => pathname.startsWith(c.href))
        );
        return found?.id ?? null;
    }, [pathname, filteredNavigation]);

    const [open, setOpen] = useState<string | null>(defaultOpenId);
    const toggleOpen = (id: string) => setOpen((prev) => (prev === id ? null : id));

    return (
        <Sidebar>
            <SidebarContent className="hide-scrollbar">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg font-bold p-6 border-2 mb-2">
                        <span className="mr-2 text-xl">💊</span>Pharmaciano
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredNavigation.map((item) => (
                                <SidebarNavItem
                                    key={item.id ?? item.label}
                                    item={item}
                                    isOpen={open === (item.id ?? item.label)}
                                    toggleOpen={toggleOpen}
                                    pathname={pathname}
                                    isSuperAdmin={isSuperAdmin}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <div className="mt-auto border-t px-4 py-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col leading-tight">
                        <span className="text-xs font-medium text-muted-foreground">
                            Logged in as
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                            {user?.name || user?.email || 'User'}
                        </span>
                    </div>
                    <div className="shrink-0">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};