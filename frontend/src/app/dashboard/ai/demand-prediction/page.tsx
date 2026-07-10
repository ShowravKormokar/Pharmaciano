"use client";

import { useEffect, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForecastStore } from "@/store/aiForecast.store";
import AiSectionHeader from "@/components/ai/AiSectionHeader";
import ForecastFilter from "@/components/ai/ForecastFilter";
import ForecastTable from "@/components/ai/ForecastTable";
import ForecastTableSkeleton, { KpiSkeleton, ChartsSkeleton } from "@/components/ai/ForecastSkeleton";
import ForecastEmptyState from "@/components/ai/ForecastEmptyState";
import ForecastErrorState from "@/components/ai/ForecastErrorState";
import ForecastSummaryCards from "@/components/ai/ForecastSummaryCards";
import ForecastMetaBar from "@/components/ai/ForecastMetaBar";
import DemandStatusChart from "@/components/ai/DemandStatusChart";
import StockHealthChart from "@/components/ai/StockHealthChart";
import TopDemandChart from "@/components/ai/TopDemandChart";
import {
    summarizeForecast,
    demandStatusDistribution,
    stockHealthDistribution,
    topPredictedDemand,
} from "@/components/ai/forecastAnalytics";


export default function DemandPredictionPage() {
    const {
        allForecasts,
        meta,
        totalRecords,
        truncated,
        loading,
        errorType,
        errorMessage,
        lastUpdated,
        filters,
        fetchForecast,
        resetFilters,
    } = useForecastStore();

    useEffect(() => {
        fetchForecast();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const summary = useMemo(() => summarizeForecast(allForecasts), [allForecasts]);
    const demandData = useMemo(() => demandStatusDistribution(allForecasts), [allForecasts]);
    const stockData = useMemo(() => stockHealthDistribution(allForecasts), [allForecasts]);
    const topDemandData = useMemo(() => topPredictedDemand(allForecasts, 6), [allForecasts]);

    const handleRetry = () => fetchForecast(filters);
    const handleClearAndRetry = () => {
        resetFilters();
        fetchForecast({
            medicineName: undefined,
            barcode: undefined,
            fromDate: undefined,
            toDate: undefined,
            organizationId: undefined,
            branchId: undefined,
        });
    };

    return (
        <div className="space-y-6 p-6">
            <AiSectionHeader
                icon={TrendingUp}
                title="Demand Prediction"
                subtitle="AI-powered sales forecasting for medicine batches, based on sales history, current stock and expiry."
                onRefresh={handleRetry}
                refreshing={loading}
            />

            <Card>
                <CardContent className="p-6">
                    <ForecastFilter />
                </CardContent>
            </Card>

            {meta && !loading && !errorType && (
                <ForecastMetaBar meta={meta} lastUpdated={lastUpdated} truncated={truncated} />
            )}

            {loading && (
                <>
                    <KpiSkeleton />
                    <ChartsSkeleton />
                    <Card>
                        <CardContent className="p-6">
                            <ForecastTableSkeleton />
                        </CardContent>
                    </Card>
                </>
            )}

            {!loading && errorType === "not_found" && (
                <Card>
                    <CardContent>
                        <ForecastEmptyState
                            message={errorMessage ?? "Try widening the date range or clearing filters."}
                            onClearFilters={handleClearAndRetry}
                        />
                    </CardContent>
                </Card>
            )}

            {!loading && errorType === "server_error" && (
                <Card>
                    <CardContent>
                        <ForecastErrorState message={errorMessage ?? "Please try again."} onRetry={handleRetry} />
                    </CardContent>
                </Card>
            )}

            {!loading && !errorType && allForecasts.length > 0 && (
                <>
                    <ForecastSummaryCards summary={summary} />

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <DemandStatusChart data={demandData} />
                        <StockHealthChart data={stockData} />
                        <TopDemandChart data={topDemandData} />
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Forecast Details</CardTitle>
                            <span className="text-sm text-muted-foreground">{totalRecords} total records analyzed</span>
                        </CardHeader>
                        <CardContent>
                            <ForecastTable items={allForecasts} />
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
