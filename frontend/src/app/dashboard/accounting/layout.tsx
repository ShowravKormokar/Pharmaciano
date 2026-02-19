import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function AccountingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PermissionGuard module="accounting">
            {children}
        </PermissionGuard>
    );
}
