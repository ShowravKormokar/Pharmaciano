'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Menu, Home, ChevronRight } from 'lucide-react'
import { ModeToggle } from '../ui/modeToggle'

export function DashboardHeader() {
    const [userEmail, setUserEmail] = useState('User')
    const pathname = usePathname()

    useEffect(() => {
        const email = localStorage.getItem('userEmail')
        if (email) {
            setUserEmail(email)
        }
    }, [])

    // Simple breadcrumb generation
    const getBreadcrumbItems = () => {
        if (pathname === '/dashboard') {
            return [
                { label: 'Dashboard', href: '/dashboard', isCurrent: true }
            ]
        }

        const paths = pathname.split('/').filter(path => path)
        const items = [
            { label: 'Dashboard', href: '/dashboard', isCurrent: false }
        ]

        let currentPath = ''
        paths.forEach((path, index) => {
            currentPath += `/${path}`
            const isLast = index === paths.length - 1

            // Format label: "users-list" -> "Users List"
            const label = path
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')

            items.push({
                label,
                href: currentPath,
                isCurrent: isLast
            })
        })

        return items
    }

    const breadcrumbItems = getBreadcrumbItems()

    return (
        <header className="bg-card border-b">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden bg-transparent text-transparent"
                        onClick={() => {
                            const event = new CustomEvent('toggleSidebar')
                            window.dispatchEvent(event)
                        }}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Breadcrumb */}
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbItems.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <BreadcrumbItem>
                                        {item.isCurrent ? (
                                            <BreadcrumbPage className="text-sm font-medium">
                                                {item.label}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink
                                                asChild
                                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <Link href={item.href}>
                                                    {index === 0 ? <Home className="h-4 w-4" /> : item.label}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>

                                    {index < breadcrumbItems.length - 1 && (
                                        <BreadcrumbSeparator>
                                            <ChevronRight className="h-4 w-4" />
                                        </BreadcrumbSeparator>
                                    )}
                                </div>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
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
}