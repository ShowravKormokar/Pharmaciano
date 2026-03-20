import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="reports"><div className="space-y-4">{children}</div></PermissionGuard>
}