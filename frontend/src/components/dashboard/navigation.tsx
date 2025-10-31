import Link from 'next/link'
import { Home, Users, ShoppingCart, LogOut } from 'lucide-react'
import { LogoutButton } from './logout-button'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Sales', href: '/dashboard/sales', icon: ShoppingCart },
]

export function Navigation() {
    return (
        <div className="space-y-1">
            {navigation.map((item) => {
                const Icon = item.icon
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 group"
                    >
                        <Icon className="h-5 w-5" />
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