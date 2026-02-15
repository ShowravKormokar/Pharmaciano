"use client";

import { RoleGuard } from "@/hooks/guards/RoleGuard";
import UserList from "./user-list/page";

export default function UsersPage() {
    return (
        <RoleGuard roles={["Super Admin", "Manager"]}>
            <UserList />
        </RoleGuard>
    );
}
