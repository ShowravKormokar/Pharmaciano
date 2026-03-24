import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function RolesLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="role"><div className="space-y-4">{children}</div></PermissionGuard>
}