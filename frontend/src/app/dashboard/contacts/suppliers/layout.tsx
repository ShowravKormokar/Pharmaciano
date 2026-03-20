import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function SuppliersLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="supplier"><div className="space-y-4">{children}</div></PermissionGuard>
};