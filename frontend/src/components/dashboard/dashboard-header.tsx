"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/modeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Bell, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardHeader() {
    const pathname = usePathname();
    const [notiCount, setNotiCount] = useState(3);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (notiCount === 0) return;

        const interval = setInterval(() => {
            setShake(true);

            setTimeout(() => {
                setShake(false);
            }, 500); // shake duration
        }, 1500);

        return () => clearInterval(interval);
    }, [notiCount]);

    const handleNotificationClick = () => {
        setNotiCount(0);
        setShake(false);
    };


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
                <nav aria-label="breadcrumb" className="md:flex items-center gap-1 text-[12px] text-muted-foreground hidden">
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

            <div className="flex items-center gap-2">

                {/* 🔹 Quick Navigation Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="hidden sm:inline">Quick</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/sales/pos">POS</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/sales/sales-list">Sales List</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/inventory/medicines">Inventory</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* 🔔 Notification Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative border bg-primary-foreground"
                        >
                            <Bell className="h-5 w-5" />

                            {notiCount > 0 && (
                                <span
                                    className={`absolute -top-1 -right-1 text-[10px] bg-primary text-white rounded-full px-1.5 py-px ${shake ? "animate-shake-loop" : ""
                                        }`}
                                >
                                    {notiCount}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuLabel className="flex justify-between items-center">Notifications
                            <span
                                onClick={handleNotificationClick}
                                className="text-[0.7rem] text-ring cursor-pointer border px-1 rounded-lg"
                            >
                                Mark all as read
                            </span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                            Dummy notifications
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            Notification system not ready yet
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            Coming soon!
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-center text-sm text-muted-foreground"> View all </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <ModeToggle />
            </div>
        </header>
    );
}