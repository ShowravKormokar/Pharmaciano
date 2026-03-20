import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function PurchaseLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="purchase"><div className="space-y-4">{children}</div></PermissionGuard>
}