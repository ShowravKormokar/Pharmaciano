"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccountStore } from "@/store/account.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Eye, PlusCircle, TrendingUp, Wallet } from "lucide-react";

export default function AccountingOverviewPage() {
    const router = useRouter();
    const { accounts, stats, fetchAccounts, loading } = useAccountStore();

    useEffect(() => {
        fetchAccounts({ page: 1, limit: 5 });
    }, [fetchAccounts]);

    // Memoize recent accounts to avoid recreating array on every render
    const recentAccounts = useMemo(() => {
        return [...accounts]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    }, [accounts]);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Accounting Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Manage chart of accounts, track financial transactions.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    title="Total Accounts"
                    value={stats.total}
                    icon={<BookOpen className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Active Accounts"
                    value={stats.active}
                    icon={<TrendingUp className="h-5 w-5 text-green-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Inactive Accounts"
                    value={stats.inActive}
                    icon={<Wallet className="h-5 w-5 text-red-600" />}
                    loading={loading}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/accounting/list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View All Accounts
                    </Button>
                </Link>
                <Link href="/dashboard/accounting/add">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Account
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recently Added Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : recentAccounts.length > 0 ? (
                        <div className="space-y-3">
                            {recentAccounts.map((account) => (
                                <div
                                    key={account._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">{account.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Code: {account.code} | Type: {account.type}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${account.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {account.isActive ? "Active" : "Inactive"}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                router.push(`/dashboard/accounting/view/${account._id}`)
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No accounts found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function MetricCard({ title, value, icon, loading }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{value}</div>}
            </CardContent>
        </Card>
    );
}