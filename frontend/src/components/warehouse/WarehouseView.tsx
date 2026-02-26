"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { WarehouseItem } from "@/types/warehouse";

interface Props {
    warehouse: WarehouseItem;
}

export default function WarehouseView({ warehouse }: Props) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Warehouse Details</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Warehouse Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{warehouse.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={warehouse.isActive ? "default" : "secondary"}>
                                {warehouse.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p>{warehouse.location}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p>{warehouse.capacity}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Branch</p>
                        {warehouse.branchId ? (
                            <div className="bg-muted/30 p-3 rounded-lg">
                                <p className="font-medium">{warehouse.branchId.name}</p>
                                {warehouse.branchId.address && (
                                    <p className="text-sm text-muted-foreground">{warehouse.branchId.address}</p>
                                )}
                                {warehouse.branchId.contact && (
                                    <div className="mt-2 text-sm">
                                        {warehouse.branchId.contact.phone && <p>Phone: {warehouse.branchId.contact.phone}</p>}
                                        {warehouse.branchId.contact.email && <p>Email: {warehouse.branchId.contact.email}</p>}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>{warehouse.branchName || "N/A"}</p>
                        )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p>
                                {warehouse.createdBy?.name || "System"}
                                {warehouse.createdBy?.email && (
                                    <span className="text-xs ml-2">({warehouse.createdBy.email})</span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>
                                {warehouse.createdAt
                                    ? format(new Date(warehouse.createdAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>
                                {warehouse.updatedAt
                                    ? format(new Date(warehouse.updatedAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}