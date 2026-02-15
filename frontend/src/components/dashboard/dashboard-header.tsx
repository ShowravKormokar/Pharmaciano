"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/modeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export function DashboardHeader() {
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuthStore();


    // Generate breadcrumb items from pathname
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        return { href, label };
    });

    return (
        <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
            <div className="flex items-center gap-4">
                <SidebarTrigger />

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
                    {breadcrumbs.map((crumb, idx) => (
                        <span key={crumb.href} className="flex items-center gap-1">
                            {idx > 0 && <span className="select-none">/</span>}
                            {idx === breadcrumbs.length - 1 ? (
                                <span className="font-medium">{crumb.label}</span>
                            ) : (
                                <Link href={crumb.href} className="hover:underline">
                                    {crumb.label}
                                </Link>
                            )}
                        </span>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div>
                    <span className="mt-0.5 inline-flex w-fit rounded-md bg-primary/10 px-2 py-0.5 text-[8px] lg:text-[11px] font-semibold text-primary">
                        <a href="/dashboard/user-profile">{user?.roleId?.name?.toUpperCase()}</a>
                    </span>
                </div>
                <ModeToggle />
            </div>
        </header>
    );
}