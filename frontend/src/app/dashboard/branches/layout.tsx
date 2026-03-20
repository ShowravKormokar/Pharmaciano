import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function BrancheLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="branches">{children}</PermissionGuard>
}