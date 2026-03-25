"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { forwardRef, type ComponentPropsWithoutRef, type MouseEvent } from "react";
import { rbac, type AccessConfig } from "@/lib/rbac";
import { useAuthStore } from "@/store/auth.store";

type PermissionLinkProps = AccessConfig &
    Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
        href: string;
        redirectTo?: string;
        onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
    };

export const PermissionLink = forwardRef<HTMLAnchorElement, PermissionLinkProps>(
    function PermissionLink(
        {
            href,
            children,
            className,
            redirectTo = "/dashboard/unauthorized",
            permission,
            module,
            onClick,
            ...linkProps
        },
        ref
    ) {
        const router = useRouter();
        const loading = useAuthStore((s) => s.loading);

        function handleClick(e: MouseEvent<HTMLAnchorElement>) {
            // Call any user-provided onClick first
            onClick?.(e);
            if (e.defaultPrevented) return;

            if (loading) {
                e.preventDefault();
                return;
            }

            const access = rbac.evaluate({ permission, module });

            if (access === false) {
                e.preventDefault();
                router.replace(redirectTo);
            }
        }

        return (
            <Link
                ref={ref}
                href={href}
                className={className}
                onClick={handleClick}
                {...linkProps}
            >
                {children}
            </Link>
        );
    }
);

PermissionLink.displayName = "PermissionLink";