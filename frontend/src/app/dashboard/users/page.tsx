"use client";

import { RoleGuard } from "@/hooks/guards/RoleGuard";
import UserList from "./user-list/page";

export default function UsersPage() {
    return (
        <RoleGuard roles={["SUPER_ADMIN", "MANAGER"]}>
            <UserList />
        </RoleGuard>
    );
}
