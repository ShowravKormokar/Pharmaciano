"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, ShoppingCart, LogOut } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Sales", href: "/dashboard/sales", icon: ShoppingCart },
];

export function SidebarNav() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    return (
        <SidebarMenu>
            {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                        <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}

            {/* Logout */}
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/logout">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}