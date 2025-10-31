'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Users, ShoppingCart } from 'lucide-react'
import { LogoutButton } from './logout-button'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Sales', href: '/dashboard/sales', icon: ShoppingCart },
]

export function Navigation() {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    }

    return (
        <div className="space-y-1">
            {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                            active
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                    >
                        <Icon className={cn(
                            "h-5 w-5 transition-colors",
                            active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                )
            })}

            {/* Logout Button */}
            <div className="pt-4 mt-4 border-t">
                <LogoutButton />
            </div>
        </div>
    )
};