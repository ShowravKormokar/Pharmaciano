"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCategoryStore } from "@/store/category.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag, Eye, PlusCircle } from "lucide-react";

export default function CategoryOverviewPage() {
    const router = useRouter();
    const { categories, fetchCategories, loading } = useCategoryStore();
    const [metrics, setMetrics] = useState({
        total: 0,
        active: 0,
        inactive: 0,
    });

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        if (categories.length) {
            const active = categories.filter((c) => c.isActive).length;
            setMetrics({
                total: categories.length,
                active,
                inactive: categories.length - active,
            });
        }
    }, [categories]);

    const recentCategories = [...categories]
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        })
        .slice(0, 5);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Category Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Manage product categories for your inventory.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    title="Total Categories"
                    value={metrics.total}
                    icon={<Tag className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Active Categories"
                    value={metrics.active}
                    icon={<Tag className="h-5 w-5 text-green-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Inactive Categories"
                    value={metrics.inactive}
                    icon={<Tag className="h-5 w-5 text-red-600" />}
                    loading={loading}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/inventory/categories/category-list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Category List
                    </Button>
                </Link>
                <Link href="/dashboard/inventory/categories/add">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Category
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recently Added Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : recentCategories.length > 0 ? (
                        <div className="space-y-3">
                            {recentCategories.map((category) => (
                                <div
                                    key={category._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">{category.name}</p>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {category.description || "No description"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${category.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {category.isActive ? "Active" : "Inactive"}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                router.push(`/dashboard/inventory/categories/view/${category._id}`)
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No categories found.</p>
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