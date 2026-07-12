"use client";

import { useEffect, useState } from "react";
import { useJournalStore } from "@/store/journal.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import JournalTable from "@/components/journal/JournalTable";
import JournalTableSkeleton from "@/components/journal/JournalTableSkeleton";
import JournalFilter from "@/components/journal/JournalFilter";

export default function JournalListPage() {
    const { journals, pagination, stats, loading, fetchJournals } = useJournalStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        referenceType: "all",
        isReversed: "all",
        fromDate: "",
        toDate: "",
    });
    const limit = 20;

    useEffect(() => {
        const params: any = { page: currentPage, limit };
        if (filters.referenceType !== "all") params.referenceType = filters.referenceType;
        if (filters.isReversed !== "all") params.isReversed = filters.isReversed === "true";
        if (filters.fromDate) params.fromDate = filters.fromDate;
        if (filters.toDate) params.toDate = filters.toDate;
        fetchJournals(params);
    }, [currentPage, filters, fetchJournals]);

    const totalPages = Math.ceil(pagination.total / limit);

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Journal Entries</h1>
                    <p className="text-muted-foreground mt-1">View all accounting journal entries</p>
                </div>
                <Button size="sm" onClick={() => fetchJournals({ page: currentPage, limit })} disabled={loading}>
                    <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardContent className="px-6">
                    <JournalFilter onFilterChange={setFilters} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardDescription>List of all journal entries</CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Total: {pagination.total} | Active: {stats.totalUnreversals} | Reversed: {stats.totalReversals}
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <JournalTableSkeleton />
                    ) : (
                        <>
                            <JournalTable journals={journals} />
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