'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userRole')
        window.location.href = '/login'
    }

    return (
        <Button
            variant="outline"
            className="w-full justify-start space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
        >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
        </Button>
    )
};