"use client";

import { useEffect, useState } from "react";
import { useAccountStore } from "@/store/account.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, RefreshCcw } from "lucide-react";
import AccountTable from "@/components/account/AccountTable";
import AccountTableSkeleton from "@/components/account/AccountTableSkeleton";
import AccountFilter from "@/components/account/AccountFilter";

export default function AccountListPage() {
    const { accounts, pagination, stats, loading, fetchAccounts } = useAccountStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ type: "all", isActive: "all" });
    const limit = 10;

    useEffect(() => {
        const params: any = { page: currentPage, limit };
        if (searchTerm) params.search = searchTerm;
        if (filters.type !== "all") params.type = filters.type;
        if (filters.isActive !== "all") params.isActive = filters.isActive === "true";
        fetchAccounts(params);
    }, [currentPage, searchTerm, filters, fetchAccounts]);

    const totalPages = Math.ceil(pagination.total / limit);

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Chart of Accounts</h1>
                    <p className="text-muted-foreground mt-1">Manage financial accounts</p>
                </div>
                <Button size="sm" onClick={() => fetchAccounts({ page: currentPage, limit })} disabled={loading}>
                    <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by account name..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <AccountFilter onFilterChange={setFilters} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardDescription>List of all chart of accounts</CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Total: {pagination.total} | Active: {stats.active} | Inactive: {stats.inActive}
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <AccountTableSkeleton />
                    ) : (
                        <>
                            <AccountTable accounts={accounts} />
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm">Page {currentPage} of {totalPages}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}