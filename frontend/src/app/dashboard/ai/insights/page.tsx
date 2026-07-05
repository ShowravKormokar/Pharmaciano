"use client";

import { useEffect, useMemo } from "react";
import { useForecastStore } from "@/store/aiForecast.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, TrendingUp, Package, AlertTriangle } from "lucide-react";
import ForecastSkeleton from "@/components/ai/ForecastSkeleton";
import TopRecommendationsChart from "@/components/ai/TopRecommendationsChart";
import ForecastTable from "@/components/ai/ForecastTable";
import StockStatusChart from "@/components/ai/tockStatusChart";

export default function BusinessInsightsPage() {
    const { forecasts, meta, loading, fetchForecast, filters } = useForecastStore();

    useEffect(() => {
        fetchForecast({ ...filters, limit: 100, page: 1 });
    }, []);

    const insights = useMemo(() => {
        if (forecasts.length === 0) return null;

        const totalMedicines = forecasts.length;
        const totalPredictedSales = forecasts.reduce((sum, f) => sum + (f.predicted_sales_next_30_days || 0), 0);
        const lowStock = forecasts.filter(f => f.current_stock < f.predicted_sales_next_30_days * 0.5);
        const criticalStock = forecasts.filter(f => f.current_stock < f.predicted_sales_next_30_days * 0.2);
        const adequate = forecasts.filter(f => f.current_stock >= f.predicted_sales_next_30_days * 0.5);
        const topRecommendations = [...forecasts]
            .sort((a, b) => b.predicted_sales_next_30_days - a.predicted_sales_next_30_days)
            .slice(0, 5);

        return {
            totalMedicines,
            totalPredictedSales: totalPredictedSales || 0,
            lowStockCount: lowStock.length,
            criticalStockCount: criticalStock.length,
            adequateCount: adequate.length,
            topRecommendations,
        };
    }, [forecasts]);

    const refresh = () => {
        fetchForecast({ ...filters, limit: 100, page: 1 });
    };

    if (loading) return <ForecastSkeleton />;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Business Insights</h1>
                    <p className="text-muted-foreground mt-1">
                        AI-powered analytics and recommendations based on demand forecasting
                    </p>
                </div>
                <Button onClick={refresh} disabled={loading} variant="outline">
                    <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {insights ? (
                <>
                    {/* Metrics Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            title="Total Medicines"
                            value={insights.totalMedicines}
                            icon={<Package className="h-5 w-5" />}
                            description="Products with forecast data"
                        />
                        <MetricCard
                            title="Predicted Sales (30d)"
                            value={insights.totalPredictedSales}
                            icon={<TrendingUp className="h-5 w-5" />}
                            description="Units expected to be sold"
                            format="number"
                        />
                        <MetricCard
                            title="Low Stock"
                            value={insights.lowStockCount}
                            icon={<AlertTriangle className="h-5 w-5 text-yellow-600" />}
                            description={`${insights.lowStockCount} items need restocking`}
                            variant="warning"
                        />
                        <MetricCard
                            title="Critical Stock"
                            value={insights.criticalStockCount}
                            icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
                            description={`${insights.criticalStockCount} items urgently need reorder`}
                            variant="danger"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Stock Status Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <StockStatusChart
                                    critical={insights.criticalStockCount}
                                    low={insights.lowStockCount}
                                    adequate={insights.adequateCount}
                                    total={insights.totalMedicines}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Top Reorder Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TopRecommendationsChart recommendations={insights.topRecommendations} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Full Table of Top 5 Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ForecastTable forecasts={insights.topRecommendations} />
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p>
                                Based on the last {meta?.filterApplied || "available"} period, we predict a total of{" "}
                                <strong>{insights.totalPredictedSales.toLocaleString()}</strong> units will be sold in the next 30 days.
                            </p>
                            <p>
                                <strong>{insights.lowStockCount}</strong> medicines are expected to run low, of which{" "}
                                <strong>{insights.criticalStockCount}</strong> are critically low and require immediate attention.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Data analyzed from {meta?.analyzedFrom ? new Date(meta.analyzedFrom).toLocaleDateString() : "N/A"} to{" "}
                                {meta?.analyzedTo ? new Date(meta.analyzedTo).toLocaleDateString() : "N/A"}
                            </p>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        <p>No forecast data available. Try adjusting your filters or check back later.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Helper component for metric cards
function MetricCard({
    title,
    value,
    icon,
    description,
    variant = "default",
    format = "number",
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    description: string;
    variant?: "default" | "warning" | "danger";
    format?: "number" | "string";
}) {
    const formattedValue = format === "number" ? value.toLocaleString() : value;
    const variantClasses = {
        default: "",
        warning: "border-yellow-500/20 bg-yellow-50/50",
        danger: "border-red-500/20 bg-red-50/50",
    };

    return (
        <Card className={variantClasses[variant]}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formattedValue}</div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}