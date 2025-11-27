import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex w-full h-screen bg-background">
                <DashboardSidebar />

                <div className="flex-1 flex flex-col min-w-0">
                    <DashboardHeader />
                    <main className="flex-1 overflow-auto p-4 sm:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}