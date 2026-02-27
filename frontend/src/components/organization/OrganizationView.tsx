"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { OrganizationItem } from "@/types/organization";

interface Props {
    organization: OrganizationItem;
}

export default function OrganizationView({ organization }: Props) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Organization Details</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Organization Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{organization.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={organization.isActive ? "default" : "secondary"}>
                                {organization.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Trade License</p>
                            <p>{organization.tradeLicenseNo || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Drug License</p>
                            <p>{organization.drugLicenseNo || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">VAT Registration</p>
                            <p>{organization.vatRegistrationNo || "N/A"}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>{organization.address || "N/A"}</p>
                    </div>

                    <Separator />

                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Contact Information</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p>{organization.contact.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p>{organization.contact.email}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Subscription Plan</p>
                        <Badge variant="outline">{organization.subscriptionPlan}</Badge>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p>
                                {typeof organization.createdBy === "object"
                                    ? organization.createdBy?.name
                                    : organization.createdBy || "System"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>{format(new Date(organization.createdAt), "PPP p")}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>{format(new Date(organization.updatedAt), "PPP p")}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}