"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/ui/modeToggle"

export function DashboardHeader() {
    return (
        <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
                <ModeToggle />
            </div>
        </header>
    )
}