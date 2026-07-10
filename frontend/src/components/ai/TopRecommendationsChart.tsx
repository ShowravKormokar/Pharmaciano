"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ForecastItem } from "@/types/aiForecast";

interface Props {
    recommendations: ForecastItem[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e"];

export default function TopRecommendationsChart({ recommendations }: Props) {
    const data = recommendations.slice(0, 5).map((item, index) => ({
        name: item.medicine_name.length > 15 ? item.medicine_name.slice(0, 15) + "…" : item.medicine_name,
        predictedSales: item.predicted_total_sales_next_30_days,
        currentStock: item.current_stock,
        color: COLORS[index % COLORS.length],
    }));

    if (data.length === 0) {
        return (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No recommendation data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} layout="vertical" margin={{ left: 60 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                <Tooltip
                    formatter={(value, name) => {
                        if (name === "predictedSales") return [`${value} units`, "Predicted Sales"];
                        if (name === "currentStock") return [`${value} units`, "Current Stock"];
                        return value;
                    }}
                />
                <Bar dataKey="predictedSales" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}