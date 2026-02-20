"use client";

import { useEffect, useState } from "react";
import { useRoleStore } from "@/store/role.store";
import RoleTable from "@/components/roles/RoleTable";
import { Button } from "@/components/ui/button";
import { RefreshCcw, User } from "lucide-react";
import Link from "next/link";
import RoleTableSkeleton from "@/components/roles/RoleTableSkeleton";

export default function RoleListPage() {
    const { roles, fetchRoles } = useRoleStore();
    const [loading, setLoading] = useState(true);

    const loadRoles = async () => {
        setLoading(true);
        await fetchRoles();
        setLoading(false);
    };

    useEffect(() => {
        loadRoles();
    }, []);

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="lg:mb-4 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Role List
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        See all roles, permissions and take actions.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/dashboard/users/role-list/add">
                        <Button variant="outline" size="sm">
                            <User className="h-4 w-4 mr-2" />
                            Create Role
                        </Button>
                    </Link>

                    <Button size="sm" onClick={loadRoles} disabled={loading}>
                        <RefreshCcw
                            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            {loading ? <RoleTableSkeleton /> : <RoleTable roles={roles} />}
        </div>
    );
}