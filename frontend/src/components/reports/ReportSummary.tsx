"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface Metric {
    label: string;
    value: string | number;
    icon?: ReactNode;
    color?: string;
}

interface Props {
    metrics: Metric[];
}

export default function ReportSummary({ metrics }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, idx) => (
                <Card key={idx}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                                <p className={`text-2xl font-bold ${metric.color || ''}`}>{metric.value}</p>
                            </div>
                            {metric.icon && <div className="p-3 rounded-full bg-muted">{metric.icon}</div>}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}