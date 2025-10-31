'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

interface DashboardSidebarProps {
    navigation: React.ReactNode
}

export function DashboardSidebar({ navigation }: DashboardSidebarProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

    return (
        <>
            {/* Mobile menu toggle button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-3 left-4 z-50 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">P</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">Pharmaciano</span>
                        </div>

                        {/* Close button (mobile only) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close sidebar"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">{navigation}</nav>
                </div>
            </aside>
        </>
    )
}