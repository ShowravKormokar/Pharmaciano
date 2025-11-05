'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        try {
            setIsLoading(true)

            // Call API route to clear the cookie
            const res = await fetch('/api/logout', { method: 'POST' })

            if (!res.ok) {
                console.error('Failed to logout:', await res.text())
                alert('Logout failed. Please try again.')
                return
            }

            // Clear client-side data for extra safety
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('userEmail')
            localStorage.removeItem('userRole')

            // Redirect to login
            window.location.href = '/login'
        } catch (error) {
            console.error('Logout error:', error)
            alert('Unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            disabled={isLoading}
            className="w-full justify-start space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            onClick={handleLogout}
        >
            <LogOut className="h-4 w-4" />
            <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
        </Button>
    )
};