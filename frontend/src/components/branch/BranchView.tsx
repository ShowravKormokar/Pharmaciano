"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { BranchItem } from "@/types/branch";

interface Props {
    branch: BranchItem;
}

export default function BranchView({ branch }: Props) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Branch Details</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Back
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Branch Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Branch Name</p>
                            <p className="font-medium">{branch.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={branch.isActive ? "default" : "secondary"}>
                                {branch.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>{branch.address}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Contact Phone</p>
                            <p>{branch.contact?.phone || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Contact Email</p>
                            <p>{branch.contact?.email || "N/A"}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Organization</p>
                        <p>{branch.organization?.name || branch.orgName || "N/A"}</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p>{branch.createdBy?.name || "System"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>
                                {branch.createdAt
                                    ? format(new Date(branch.createdAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>
                                {branch.updatedAt
                                    ? format(new Date(branch.updatedAt), "PPP p")
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}