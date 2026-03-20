import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="settings"><div className="space-y-4">{children}</div></PermissionGuard>
}