"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBrandStore } from "@/store/brand.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Eye, PlusCircle, Globe, Factory } from "lucide-react";

export default function BrandOverviewPage() {
    const router = useRouter();
    const { brands, fetchBrands, loading } = useBrandStore();
    const [metrics, setMetrics] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        uniqueCountries: 0,
    });

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    useEffect(() => {
        if (brands.length) {
            const active = brands.filter((b) => b.isActive).length;
            const countries = new Set(brands.map((b) => b.country).filter(Boolean)).size;
            setMetrics({
                total: brands.length,
                active,
                inactive: brands.length - active,
                uniqueCountries: countries,
            });
        }
    }, [brands]);

    const recentBrands = [...brands]
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        })
        .slice(0, 5);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Brand Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Manage pharmaceutical brands and manufacturers.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Brands"
                    value={metrics.total}
                    icon={<Package className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Active Brands"
                    value={metrics.active}
                    icon={<Package className="h-5 w-5 text-green-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Inactive Brands"
                    value={metrics.inactive}
                    icon={<Package className="h-5 w-5 text-red-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Countries"
                    value={metrics.uniqueCountries}
                    icon={<Globe className="h-5 w-5" />}
                    loading={loading}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/inventory/brands/brand-list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Brand List
                    </Button>
                </Link>
                <Link href="/dashboard/inventory/brands/add">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Brand
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recently Added Brands</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : recentBrands.length > 0 ? (
                        <div className="space-y-3">
                            {recentBrands.map((brand) => (
                                <div
                                    key={brand._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">{brand.name}</p>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Factory className="h-3.5 w-3.5" />
                                                {brand.manufacturer}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Globe className="h-3.5 w-3.5" />
                                                {brand.country}
                                            </span>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${brand.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {brand.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push(`/dashboard/inventory/brands/view/${brand._id}`)}
                                    >
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No brands found.</p>
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
                {loading ? (
                    <Skeleton className="h-8 w-16" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    );
}