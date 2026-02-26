// components/roles/RoleFeatures.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useRoleStore } from "@/store/role.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function RoleFeatures() {
    const { features, fetchFeatures, loading, error } = useRoleStore();

    useEffect(() => {
        if (features.length === 0) {
            fetchFeatures();
        }
    }, [features, fetchFeatures]);

    const groupedFeatures = useMemo(() => {
        return features.reduce((acc: Record<string, typeof features>, feature) => {
            if (!acc[feature.category]) {
                acc[feature.category] = [];
            }
            acc[feature.category].push(feature);
            return acc;
        }, {});
    }, [features]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-4 md:grid-cols-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-40 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-600 bg-red-50 rounded-lg">
                Error: {error}
            </div>
        );
    }

    if (features.length === 0) {
        return (
            <div className="p-4 text-muted-foreground">
                No features found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-muted-foreground">
                All available permissions grouped by category.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(groupedFeatures)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([category, features]) => (
                        <Card key={category} className="overflow-hidden">
                            <CardHeader className="bg-muted/50 py-3">
                                <CardTitle className="text-lg">{category}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {features.map((feature) => (
                                        <div
                                            key={feature._id}
                                            className="p-4 space-y-2 hover:bg-muted/20"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-mono text-sm font-medium">
                                                        {feature.name}
                                                    </p>
                                                    {feature.description && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {feature.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <Badge
                                                    variant={
                                                        feature.isActive
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {feature.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-4 text-xs text-muted-foreground">
                                                <span>
                                                    Created:{" "}
                                                    {feature.createdAt
                                                        ? format(
                                                            new Date(feature.createdAt),
                                                            "PPP"
                                                        )
                                                        : "N/A"}
                                                </span>
                                                <span>
                                                    Updated:{" "}
                                                    {feature.updatedAt
                                                        ? format(
                                                            new Date(feature.updatedAt),
                                                            "PPP"
                                                        )
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    );
};