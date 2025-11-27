import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardSidebar />

            <SidebarInset>
                <DashboardHeader />
                <main className="p-4 sm:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}