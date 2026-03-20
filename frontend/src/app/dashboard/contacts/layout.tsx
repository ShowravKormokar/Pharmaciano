import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
    return <PermissionGuard module="contacts"><div className="space-y-4">{children}</div></PermissionGuard>
};