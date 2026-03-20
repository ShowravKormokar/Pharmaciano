import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="organization"><div className="space-y-4">{children}</div></PermissionGuard>
}