"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { CategoryItem } from "@/types/category";
import { Building2, MapPin, Package, User } from "lucide-react";

interface Props {
    category: CategoryItem | null;
    loading?: boolean;
}

export default function CategoryView({ category, loading = false }: Props) {
    const router = useRouter();

    if (loading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!category) {
        return <p className="text-red-500">Category not found</p>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Category Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium capitalize">{category.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={category.isActive ? "default" : "secondary"}>
                                {category.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="whitespace-pre-wrap capitalize">{category.description || "No description"}</p>
                    </div>

                    {/* Organization, Branch, Warehouse Section */}
                    {(category.organizationId || category.branchId || category.warehouseId) && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="text-md font-semibold mb-3 text-primary">Location Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {category.organizationId && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <Building2 className="h-4 w-4" />
                                                <span>Organization</span>
                                            </div>
                                            <p className="font-medium capitalize">{category.organizationId.name}</p>
                                        </div>
                                    )}
                                    {category.branchId && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <MapPin className="h-4 w-4" />
                                                <span>Branch</span>
                                            </div>
                                            <p className="font-medium capitalize">{category.branchId.name}</p>
                                        </div>
                                    )}
                                    {category.warehouseId && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <Package className="h-4 w-4" />
                                                <span>Warehouse</span>
                                            </div>
                                            <p className="font-medium capitalize">{category.warehouseId.name}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <Separator />

                    {/* Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Created By</p>
                            <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <p className="capitalize">{category.createdBy?.name || category.createdBy?.email || "System"}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>
                                {category.createdAt
                                    ? format(new Date(category.createdAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>
                                {category.updatedAt
                                    ? format(new Date(category.updatedAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}