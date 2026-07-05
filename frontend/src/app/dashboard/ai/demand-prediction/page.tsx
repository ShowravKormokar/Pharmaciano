"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForecastStore } from "@/store/aiForecast.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import ForecastFilter from "@/components/ai/ForecastFilter";
import ForecastTable from "@/components/ai/ForecastTable";
import ForecastSkeleton from "@/components/ai/ForecastSkeleton";
import { format } from "date-fns";

export default function DemandPredictionPage() {
    const { forecasts, meta, pagination, loading, fetchForecast, filters } = useForecastStore();
    const router = useRouter();

    useEffect(() => {
        fetchForecast();
    }, []);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
            fetchForecast({ ...filters, page });
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Demand Prediction</h1>
                    <p className="text-muted-foreground mt-1">
                        AI-powered sales forecasting for medicines
                    </p>
                </div>
                <Button
                    onClick={() => fetchForecast({ ...filters })}
                    disabled={loading}
                    variant="outline"
                >
                    <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Meta Info */}
            {meta && !loading && (
                <Card>
                    <CardContent className="py-4 flex flex-wrap gap-6 text-sm">
                        <div>
                            <span className="font-medium">Analyzed Period:</span>{" "}
                            {format(new Date(meta.analyzedFrom), "PPP")} – {format(new Date(meta.analyzedTo), "PPP")}
                        </div>
                        {meta.organizationId && (
                            <div>
                                <span className="font-medium">Organization ID:</span> {meta.organizationId}
                            </div>
                        )}
                        {meta.branchId && (
                            <div>
                                <span className="font-medium">Branch ID:</span> {meta.branchId}
                            </div>
                        )}
                        <div>
                            <span className="font-medium">Filter Applied:</span> {meta.filterApplied}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <ForecastFilter />
                </CardContent>
            </Card>

            {/* Results */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Forecast Results</CardTitle>
                    <div className="text-sm text-muted-foreground">
                        {pagination.totalRecords > 0 && (
                            <span>
                                Showing {((pagination.currentPage - 1) * pagination.limit) + 1}–
                                {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)} of {pagination.totalRecords} records
                            </span>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <ForecastSkeleton />
                    ) : (
                        <>
                            <ForecastTable forecasts={forecasts} />
                            {pagination.totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm">
                                        Page {pagination.currentPage} of {pagination.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.totalPages}
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