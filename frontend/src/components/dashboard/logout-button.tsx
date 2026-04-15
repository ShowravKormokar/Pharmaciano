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
            localStorage.removeItem("user");
            sessionStorage.removeItem("accessToken");
            cookieStore.delete("auth-token");
            document.cookie = "auth-token=; Max-Age=0; path=/";

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
            onClick={handleLogout}
            className="
        group
        flex items-center
        overflow-hidden
        w-9 hover:w-28
        h-9
        px-2
        justify-start
        transition-all duration-300 ease-in-out
        text-foreground hover:text-red-700 hover:bg-red-50
      "
        >
            {/* ICON */}
            <LogOut className="h-4 w-4 shrink-0" />

            {/* TEXT */}
            <span
                className="
          ml-2 text-sm whitespace-nowrap
          opacity-0 -translate-x-2
          group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-300
        "
            >
                {isLoading ? "Logging..." : "Logout"}
            </span>
        </Button>
    )
};