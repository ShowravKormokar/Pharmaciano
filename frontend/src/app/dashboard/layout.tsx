'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X, Home, Users, ShoppingCart } from 'lucide-react'
import { ModeToggle } from '@/components/ui/modeToggle'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Sales', href: '/dashboard/sales', icon: ShoppingCart },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userEmail, setUserEmail] = useState('User')
    const pathname = usePathname()

    useEffect(() => {
        // This code runs only on client side
        const email = localStorage.getItem('userEmail')
        if (email) {
            setUserEmail(email)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userRole')
        window.location.href = '/login'
    }

    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + '/')
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">P</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">Pharmaciano</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const active = isActive(item.href)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                  flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${active
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                        }
                `}
                                >
                                    <Icon className={`h-5 w-5 ${active ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>
                    {/* Footer */}
                    <div className="p-4 border-t">
                        <Button
                            variant="outline"
                            className="w-full justify-start space-x-3"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            <span className='text-red-800'>Logout</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top header */}
                <header className="bg-card border-b">
                    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div className="ml-2 lg:ml-0">
                                <h1 className="text-lg font-semibold text-foreground">
                                    {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
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

                <main className="flex-1 overflow-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}