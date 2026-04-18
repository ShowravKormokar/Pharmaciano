"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PurchaseReturnListPage() {
    return (
        <div className="p-6 space-y-6">
            <div><h1 className="text-2xl font-bold">Purchase Returns</h1>
                <p className="text-muted-foreground">Manage purchase returns (coming soon)</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Returns List</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This feature is under development. Please check back later.</p>
                </CardContent>
            </Card>
        </div>
    );
};