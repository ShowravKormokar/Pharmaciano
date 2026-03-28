"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { MedicineItem } from "@/types/medicine";
import { RefreshCcw } from "lucide-react";

interface Props {
    medicine: MedicineItem;
    onRefresh?: () => void;
}

export default function MedicineView({ medicine, onRefresh }: Props) {
    const router = useRouter();

    // Helper to get category name
    const categoryName = medicine.categoryId?.name || medicine.categoryName || "—";
    // Helper to get brand name
    const brandName = medicine.brandId?.name || medicine.brandName || "—";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Medicine Details</h1>
                <div className="flex gap-2">
                    {onRefresh && (
                        <Button variant="outline" size="sm" onClick={onRefresh}>
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
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium capitalize">{medicine.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Generic Name</p>
                            <p className="capitalize">{medicine.genericName || "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Category</p>
                            <p className="capitalize">{categoryName}</p>
                            {medicine.categoryId?.description && (
                                <p className="text-xs text-muted-foreground mt-1 capitalize">
                                    {medicine.categoryId.description}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Brand</p>
                            <p className="capitalize">{brandName}</p>
                            {medicine.brandId?.manufacturer && (
                                <p className="text-xs text-muted-foreground capitalize">
                                    Manufacturer: {medicine.brandId.manufacturer}
                                </p>
                            )}
                            {medicine.brandId?.country && (
                                <p className="text-xs text-muted-foreground capitalize">
                                    Country: {medicine.brandId.country}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Dosage Form</p>
                            <p className="capitalize">{medicine.dosageForm || "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Strength</p>
                            <p>{medicine.strength ? `${medicine.strength} ${medicine.unit || ""}` : "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Unit Price</p>
                            <p>TK. {medicine.unitPrice?.toFixed(2) || "—"}/-</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Units per Strip</p>
                            <p>{medicine.unitsPerStrip || "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Strip Price</p>
                            <p>Tk. {medicine.stripPrice || "—"}/-</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Tax Rate</p>
                            <p>{medicine.taxRate ? `${medicine.taxRate}%` : "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Prescription Required</p>
                            {medicine.isPrescriptionRequired ? (
                                <Badge variant="destructive">Required</Badge>
                            ) : (
                                <Badge variant="outline">OTC</Badge>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={medicine.isActive ? "default" : "secondary"}>
                                {medicine.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p>{medicine.createdBy?.name || medicine.createdBy?.email || "System"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>{medicine.createdAt ? format(new Date(medicine.createdAt), "PPP p") : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p>{medicine.updatedAt ? format(new Date(medicine.updatedAt), "PPP p") : "N/A"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}