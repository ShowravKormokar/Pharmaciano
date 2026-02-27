"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useOrganizationStore } from "@/store/organization.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Eye, PlusCircle, Users, CreditCard, Badge } from "lucide-react";

export default function OrganizationOverviewPage() {
    const router = useRouter();
    const { organizations, fetchOrganizations, loading } = useOrganizationStore();

    const [metrics, setMetrics] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        plans: { FREE: 0, BASIC: 0, PREMIUM: 0 },
    });

    useEffect(() => {
        fetchOrganizations();
    }, [fetchOrganizations]);

    useEffect(() => {
        if (organizations.length) {
            const active = organizations.filter((o) => o.isActive).length;
            const plans = { FREE: 0, BASIC: 0, PREMIUM: 0 };
            organizations.forEach((o) => {
                if (o.subscriptionPlan in plans) {
                    plans[o.subscriptionPlan as keyof typeof plans]++;
                }
            });
            setMetrics({
                total: organizations.length,
                active,
                inactive: organizations.length - active,
                plans,
            });
        }
    }, [organizations]);

    const recentOrganizations = [...organizations]
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .slice(0, 5);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Organization Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Manage organizations, their subscriptions and contacts.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Organizations"
                    value={metrics.total}
                    icon={<Building2 className="h-5 w-5" />}
                    loading={loading}
                />
                <MetricCard
                    title="Active"
                    value={metrics.active}
                    icon={<Building2 className="h-5 w-5 text-green-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Inactive"
                    value={metrics.inactive}
                    icon={<Building2 className="h-5 w-5 text-red-600" />}
                    loading={loading}
                />
                <MetricCard
                    title="Free Plan"
                    value={metrics.plans.FREE}
                    icon={<CreditCard className="h-5 w-5" />}
                    loading={loading}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/organizations/org-list">
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Organization List
                    </Button>
                </Link>
                <Link href="/dashboard/organizations/add">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Organization
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recently Added Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : recentOrganizations.length > 0 ? (
                        <div className="space-y-3">
                            {recentOrganizations.map((org) => (
                                <div
                                    key={org._id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20 transition-colors"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">{org.name}</p>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span>{org.contact.email}</span>
                                            <span>{org.contact.phone}</span>
                                            {/* <Badge variant="outline">{org.subscriptionPlan}</Badge>
                                            <Badge variant={org.isActive ? "default" : "secondary"}>
                                                {org.isActive ? "Active" : "Inactive"}
                                            </Badge> */}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.push(`/dashboard/organizations/view/${org._id}`)
                                        }
                                    >
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No organizations found.</p>
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