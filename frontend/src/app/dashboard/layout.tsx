import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { Navigation } from '@/components/dashboard/navigation'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-background">
            <DashboardSidebar navigation={<Navigation />} />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader />
                <main className="flex-1 overflow-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}