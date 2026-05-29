"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useJournalStore } from "@/store/journal.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Eye, PlusCircle, RotateCcw, TrendingUp } from "lucide-react";

export default function JournalOverviewPage() {
    const router = useRouter();
    const { journals, stats, fetchJournals, loading } = useJournalStore();

    useEffect(() => {
        fetchJournals({ page: 1, limit: 5 });
    }, [fetchJournals]);

    const recentJournals = useMemo(() => {
        return [...journals]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    }, [journals]);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Journal Entries</h1>
                <p className="text-muted-foreground mt-1">
                    Manage accounting journal entries, track reversals.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    title="Total Entries"
                    value={stats.total}
                    icon={<BookOpen className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Active Entries"
                    value={stats.totalUnreversals}
                    icon={<TrendingUp className="h-5 w-5 text-green-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Reversed Entries"
                    value={stats.totalReversals}
                    icon={<RotateCcw className="h-5 w-5 text-orange-600" />}
                    loading={loading}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/accounting/journal/list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View All Entries
                    </Button>
                </Link>
                <Link href="/dashboard/accounting/journal/add">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Journal Entry
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Journal Entries</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : recentJournals.length > 0 ? (
                        <div className="space-y-3">
                            {recentJournals.map((journal) => (
                                <div
                                    key={journal._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">
                                            {typeof journal.debitAccountId === 'object' ? journal.debitAccountId.name : "Account"} → {typeof journal.creditAccountId === 'object' ? journal.creditAccountId.name : "Account"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Amount: TK. {journal.amount.toFixed(2)} | Type: {journal.referenceType}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${journal.isReversed
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {journal.isReversed ? "Reversed" : "Active"}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                router.push(`/dashboard/accounting/journal/view/${journal._id}`)
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No journal entries found.</p>
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