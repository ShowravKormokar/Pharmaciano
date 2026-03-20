import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="inventory"><div className="space-y-4">{children}</div></PermissionGuard>
}