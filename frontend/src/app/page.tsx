'use client'

import { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import DashboardPage from './dashboard/page'

export default function HomePage() {
    const [isChecking, setIsChecking] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check if user is logged in (demo check)
        const isLoggedIn = localStorage.getItem('isLoggedIn')

        if (isLoggedIn) {
            // User is logged in, show dashboard content
            setIsChecking(false)
        } else {
            // User not logged in, redirect to login
            router.push('/login')
        }
    }, [router])

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        )
    }

    // Dashboard content when logged in
    return (
        redirect('/dashboard')
        // <DashboardPage />
    )
}