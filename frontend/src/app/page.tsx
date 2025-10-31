'use client'

import { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import DashboardPage from './dashboard/page'
import { Spinner } from '@/components/ui/shadcn-io/spinner'

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
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-center">
                    <Spinner variant={"bars"} />
                </div>
                <p className="mt-4 text-gray-600">Checking authentication...</p>
            </div>
        )
    }

    // Dashboard content when logged in
    return (
        redirect('/dashboard')
        // <DashboardPage />
    )
}