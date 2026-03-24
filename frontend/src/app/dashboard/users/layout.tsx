import { CanAccess } from "@/components/pbac/CanAccess";
import { PermissionGuard } from "@/hooks/guards/PermissionGuard";

export default function UsersRolesLayout({ children }: { children: React.ReactNode }) {
    return <CanAccess roles={["SUPER_ADMIN"]}><div className="space-y-4">{children}</div>
    </CanAccess>;
    // return <PermissionGuard module="user"><div className="space-y-4">{children}</div></PermissionGuard>
};