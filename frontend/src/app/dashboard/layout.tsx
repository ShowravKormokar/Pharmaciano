"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { filterNavigationByPermission } from "@/hooks/engine/navigation.engine";
import { navigation } from "@/constants/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, initializeAuth } = useAuthStore();
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        initializeAuth().finally(() => setAuthReady(true));
    }, []);

    const navItems = authReady ? filterNavigationByPermission(navigation) : null;

    if (!authReady || !isAuthenticated || !user || !navItems) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Spinner variant="bars" />
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="flex w-full h-screen bg-background">
                <DashboardSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <DashboardHeader />
                    <main className="flex-1 overflow-auto p-4 sm:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};