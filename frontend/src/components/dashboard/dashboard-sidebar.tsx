// DashboardSidebar.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navigation } from "./navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState<string | null>(null)

    const toggle = (key: string) =>
        setOpen(open === key ? null : key)

    return (
        <Sidebar>
            <SidebarContent>

                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>

                            {navigation.map((item) => (
                                <SidebarMenuItem key={item.label}>

                                    {/* Parent Button */}
                                    <SidebarMenuButton
                                        asChild={!item.children}
                                        onClick={() => item.children && toggle(item.label)}
                                        isActive={pathname.startsWith(item.href || "")}
                                    >
                                        {item.children ? (
                                            <button className="flex items-center gap-2">
                                                <item.icon className="h-4 w-4" /> {item.label}
                                            </button>
                                        ) : (
                                            <Link href={item.href!}>
                                                <item.icon className="h-4 w-4" /> {item.label}
                                            </Link>
                                        )}
                                    </SidebarMenuButton>

                                    {/* Child Menu */}
                                    {item.children && open === item.label && (
                                        <SidebarMenu className="ml-6 mt-2 space-y-2">
                                            {item.children.map((child) => (
                                                <SidebarMenuItem key={child.href}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={pathname.startsWith(child.href)}
                                                    >
                                                        <Link href={child.href}>
                                                            <child.icon className="h-4 w-4" /> {child.label}
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    )}

                                </SidebarMenuItem>
                            ))}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    )
}