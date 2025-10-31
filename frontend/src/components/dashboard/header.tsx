'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { ModeToggle } from '../ui/modeToggle'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Users', href: '/dashboard/users', icon: '👥' },
    { name: 'Sales', href: '/dashboard/sales', icon: '💰' },
]

export function DashboardHeader() {
    const [userEmail, setUserEmail] = useState('User')
    const pathname = usePathname()

    useEffect(() => {
        const email = localStorage.getItem('userEmail')
        if (email) {
            setUserEmail(email)
        }
    }, [])

    const getCurrentPageTitle = () => {
        const currentNav = navigation.find(item => {
            if (item.href === '/dashboard') return pathname === '/dashboard'
            return pathname.startsWith(item.href)
        })
        return currentNav?.name || 'Dashboard'
    }

    return (
        <header className="bg-card border-b">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => {
                            // This would need to be handled via context or state management
                            // For now, we'll use a simple approach
                            const event = new CustomEvent('toggleSidebar')
                            window.dispatchEvent(event)
                        }}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <div className="ml-2 lg:ml-0">
                        <h1 className="text-lg font-semibold text-foreground">
                            {getCurrentPageTitle()}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground hidden sm:block">
                        Welcome, {userEmail}
                    </div>
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
};