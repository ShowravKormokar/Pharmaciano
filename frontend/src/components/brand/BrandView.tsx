"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { BrandItem } from "@/types/brand";
import { RefreshCcw } from "lucide-react";

interface Props {
    brand: BrandItem | null;
    loading?: boolean;
    onRefresh?: () => void;
}

export default function BrandView({ brand, loading = false, onRefresh }: Props) {
    const router = useRouter();

    if (loading || !brand) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Brand Details</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
                            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                        <Button variant="outline" onClick={() => router.back()}>
                            Back
                        </Button>
                    </div>
                </div>
                <Card>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Brand Details</h1>
                <div className="flex gap-2">
                    {onRefresh && (
                        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => router.back()}>
                        Back
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Brand Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium capitalize">{brand.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Manufacturer</p>
                            <p className="font-medium capitalize">{brand.manufacturer}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Country</p>
                            <p className="capitalize">{brand.country}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={brand.isActive ? "default" : "secondary"}>
                                {brand.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    {/* Organization, Branch, Warehouse (if available) */}
                    {(brand.organizationId || brand.branchId || brand.warehouseId) && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                {brand.organizationId && (
                                    <div>
                                        <p className="text-muted-foreground">Organization</p>
                                        <p className="font-medium capitalize">{brand.organizationId.name}</p>
                                    </div>
                                )}
                                {brand.branchId && (
                                    <div>
                                        <p className="text-muted-foreground">Branch</p>
                                        <p className="font-medium capitalize">{brand.branchId.name}</p>
                                    </div>
                                )}
                                {brand.warehouseId && (
                                    <div>
                                        <p className="text-muted-foreground">Warehouse</p>
                                        <p className="font-medium capitalize">{brand.warehouseId.name}</p>
                                    </div>
                                )}
                            </div>
                            <Separator />
                        </>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p className="capitalize">{brand.createdBy?.name || brand.createdBy?.email || "System"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>
                                {brand.createdAt
                                    ? format(new Date(brand.createdAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>
                                {brand.updatedAt
                                    ? format(new Date(brand.updatedAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}