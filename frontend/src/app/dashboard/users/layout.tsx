import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="user"><div className="space-y-4">{children}</div></PermissionGuard>
}