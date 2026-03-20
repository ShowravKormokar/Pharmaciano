"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { SupplierItem } from "@/types/supplier";

interface Props {
    supplier: SupplierItem;
}

export default function SupplierView({ supplier }: Props) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Supplier Details</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Supplier Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{supplier.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={supplier.isActive ? "default" : "secondary"}>
                                {supplier.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        {supplier.contactPerson && (
                            <div>
                                <p className="text-sm text-muted-foreground">Contact Person</p>
                                <p>{supplier.contactPerson}</p>
                            </div>
                        )}
                        {supplier.phone && (
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p>{supplier.phone}</p>
                            </div>
                        )}
                        {supplier.email && (
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p>{supplier.email}</p>
                            </div>
                        )}
                        {supplier.address && (
                            <div className="md:col-span-2">
                                <p className="text-sm text-muted-foreground">Address</p>
                                <p className="whitespace-pre-wrap">{supplier.address}</p>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p>{supplier.createdBy?.name || supplier.createdBy?.email || "System"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>
                                {supplier.createdAt
                                    ? format(new Date(supplier.createdAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>
                                {supplier.updatedAt
                                    ? format(new Date(supplier.updatedAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}