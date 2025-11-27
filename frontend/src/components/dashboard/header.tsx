"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Home, ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/modeToggle";

export function DashboardHeader() {
    const pathname = usePathname();
    const [userEmail, setUserEmail] = useState("User");

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        if (email) setUserEmail(email);
    }, []);

    // Build breadcrumbs
    const paths = pathname.split("/").filter(Boolean);
    const items = [{ label: "Dashboard", href: "/dashboard" }];

    let builtPath = "";
    paths.forEach((p) => {
        builtPath += `/${p}`;
        items.push({
            label: p.charAt(0).toUpperCase() + p.slice(1),
            href: builtPath,
        });
    });

    return (
        <header className="bg-card border-b p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <SidebarTrigger />

                <Breadcrumb>
                    <BreadcrumbList>
                        {items.map((item, i) => (
                            <div key={i} className="flex items-center">
                                <BreadcrumbItem>
                                    {i === items.length - 1 ? (
                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={item.href}>
                                                {i === 0 ? <Home className="h-4 w-4" /> : item.label}
                                            </Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>

                                {i < items.length - 1 && (
                                    <BreadcrumbSeparator>
                                        <ChevronRight className="h-4 w-4" />
                                    </BreadcrumbSeparator>
                                )}
                            </div>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex items-center gap-4">
                <span className="hidden sm:block text-sm text-muted-foreground">
                    Welcome, {userEmail}
                </span>
                <ModeToggle />
            </div>
        </header>
    );
}