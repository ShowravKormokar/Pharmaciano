"use client";

/**
 * PermissionLink.tsx — Permission-aware navigation link
 *
 * Wraps Next.js <Link> and intercepts the click event BEFORE
 * the route change happens. If the user lacks permission, it
 * redirects to /dashboard/unauthorized instantly — no page flash.
 *
 * Use this in sidebar/nav instead of bare <Link> for child items.
 *
 * @example
 * <PermissionLink
 *   href="/dashboard/users/user-list"
 *   permission="user:read"
 * >
 *   <SidebarItem icon={Users} label="User List" />
 * </PermissionLink>
 *
 * @example — module-level check
 * <PermissionLink href="/dashboard/accounting" module="accounting">
 *   Accounting
 * </PermissionLink>
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { rbac, type AccessConfig } from "@/lib/rbac";
import { useAuthStore } from "@/store/auth.store";

interface PermissionLinkProps extends AccessConfig {
    href: string;
    children: ReactNode;
    className?: string;
    redirectTo?: string;
}

export function PermissionLink({
    href,
    children,
    className,
    redirectTo = "/dashboard/unauthorized",
    ...accessConfig
}: PermissionLinkProps) {
    const router = useRouter();
    const loading = useAuthStore((s) => s.loading);

    function handleClick(e: MouseEvent<HTMLAnchorElement>) {
        if (loading) {
            e.preventDefault();
            return;
        }

        const access = rbac.evaluate(accessConfig);

        if (access === false) {
            e.preventDefault();
            router.replace(redirectTo);
        }
        // access === null (loading edge case) or true → let Link handle it
    }

    return (
        <Link href={href} className={className} onClick={handleClick}>
            {children}
        </Link>
    );
}
