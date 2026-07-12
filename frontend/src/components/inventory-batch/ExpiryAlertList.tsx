"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useInventoryBatchStore } from "@/store/inventoryBatch.store";
import { getExpiryAlerts, ExpiryAlert } from "@/lib/dashboardHelpers";
import { format } from "date-fns"; // or dayjs
import dayjs from "dayjs";

export default function ExpiryAlertList() {
    const { batches, fetchBatches, loading } = useInventoryBatchStore();
    const [expired, setExpired] = useState<ExpiryAlert[]>([]);
    const [expiringSoon, setExpiringSoon] = useState<ExpiryAlert[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchBatches();
            setIsLoading(false);
        };
        loadData();
    }, [fetchBatches]);

    useEffect(() => {
        if (!loading && batches.length > 0) {
            const { expired, expiringSoon } = getExpiryAlerts(batches, 30);
            setExpired(expired);
            setExpiringSoon(expiringSoon);
        } else {
            setExpired([]);
            setExpiringSoon([]);
        }
    }, [batches, loading]);

    if (isLoading || loading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div>
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-6 w-16" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const hasAlerts = expired.length > 0 || expiringSoon.length > 0;

    if (!hasAlerts) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Expiry Alerts</CardTitle>
                    <CardDescription>All medicines are within safe expiry range</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No expired or soon‑to‑expire products found.
                    </div>
                </CardContent>
            </Card>
        );
    }

    const renderAlertList = (alerts: ExpiryAlert[], title: string, variant: "expired" | "expiring_soon") => {
        if (alerts.length === 0) return null;
        const badgeVariant = variant === "expired" ? "destructive" : "warning";
        const badgeText = variant === "expired" ? "Expired" : "Expiring Soon";
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {title} <Badge variant={badgeVariant as any}>{alerts.length}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {alerts.map((alert, index) => (
                            <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">{alert.medicineName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Batch: {alert.batchNo} | Qty: {alert.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">
                                        {dayjs(alert.expiryDate).format("DD MMM YYYY")}
                                    </p>
                                    <Badge variant={badgeVariant as any}>{badgeText}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {renderAlertList(expired, "Expired Products", "expired")}
            {renderAlertList(expiringSoon, "Expiring Soon (within 30 days)", "expiring_soon")}
        </div>
    );
}