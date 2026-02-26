"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useUserStore } from "@/store/user.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, UserPlus, Search } from "lucide-react";
import Link from "next/link";
import UserTable from "@/components/users/UserTable";
import UserTableSkeleton from "@/components/users/UserTableSkeleton";
import UserFilter from "@/components/users/UserFilter";

export default function UserListPage() {
    const { users, fetchUsers, removeUser, loading } = useUserStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ role: "all", status: "all" });
    const [deleting, setDeleting] = useState(false);

    const loadUsers = useCallback(async () => {
        await fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleDelete = async (id: string) => {
        setDeleting(true);
        await removeUser(id);
        setDeleting(false);
    };

    // Filter users based on search term, role, and status
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            // Search filter
            const matchesSearch =
                !searchTerm.trim() ||
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.roleId?.name?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            // Role filter
            if (filters.role !== "all" && user.roleId?.name !== filters.role) {
                return false;
            }

            // Status filter
            if (filters.status !== "all") {
                const isActive = filters.status === "active";
                if (user.isActive !== isActive) return false;
            }

            return true;
        });
    }, [users, searchTerm, filters]);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        User List
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage system users, their roles and status.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/dashboard/users/add">
                        <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Create User
                        </Button>
                    </Link>

                    <Button size="sm" onClick={loadUsers} disabled={loading}>
                        <RefreshCcw
                            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <UserFilter users={users} onFilterChange={setFilters} />
            </div>

            {/* Table or Skeleton */}
            {loading ? (
                <UserTableSkeleton />
            ) : (
                <UserTable users={filteredUsers} onDelete={handleDelete} />
            )}
        </div>
    );
}