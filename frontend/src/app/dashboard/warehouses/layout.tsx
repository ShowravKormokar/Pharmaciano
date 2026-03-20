import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="branches"><div className="space-y-4">{children}</div></PermissionGuard>
}