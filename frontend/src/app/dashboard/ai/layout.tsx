import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function AiLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="ai"><div className="space-y-4">{children}</div></PermissionGuard>
}