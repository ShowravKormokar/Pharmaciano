import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function SalesLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="sales"><div className="space-y-4">{children}</div></PermissionGuard>
}