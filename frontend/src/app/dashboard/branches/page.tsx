"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBranchStore } from "@/store/branch.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Eye, PlusCircle, MapPin, Phone } from "lucide-react";

export default function BranchOverviewPage() {
    const router = useRouter();
    const { branches, fetchBranches, loading } = useBranchStore();

    const [metrics, setMetrics] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        distinctOrgs: 0,
    });

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branches.length) {
            const active = branches.filter((b) => b.isActive).length;
            const orgs = new Set(
                branches.map((b) => b.organization?.name || b.orgName).filter(Boolean)
            ).size;
            setMetrics({
                total: branches.length,
                active,
                inactive: branches.length - active,
                distinctOrgs: orgs,
            });
        }
    }, [branches]);

    const recentBranches = [...branches]
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .slice(0, 5);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Branch Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Manage branches and their contact information.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Branches"
                    value={metrics.total}
                    icon={<Building2 className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Active Branches"
                    value={metrics.active}
                    icon={<Building2 className="h-5 w-5 text-green-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Inactive Branches"
                    value={metrics.inactive}
                    icon={<Building2 className="h-5 w-5 text-red-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Organizations"
                    value={metrics.distinctOrgs}
                    icon={<Building2 className="h-5 w-5" />}
                    loading={loading}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/branches/list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Branch List
                    </Button>
                </Link>
                <Link href="/dashboard/branches/add">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Branch
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recently Added Branches</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : recentBranches.length > 0 ? (
                        <div className="space-y-3">
                            {recentBranches.map((branch) => (
                                <div
                                    key={branch._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20 transition-colors"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">{branch.name}</p>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {branch.address || "N/A"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Phone className="h-3.5 w-3.5" />
                                                {branch.contact?.phone || "N/A"}
                                            </span>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${branch.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {branch.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.push(`/dashboard/branches/view/${branch._id}`)
                                        }
                                    >
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No branches found.</p>
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