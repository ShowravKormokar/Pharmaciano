"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
    critical: number;
    low: number;
    adequate: number;
    total: number;
}

const COLORS = {
    critical: "#ef4444",   // red
    low: "#f59e0b",        // yellow
    adequate: "#22c55e",   // green
};

export default function StockStatusChart({ critical, low, adequate, total }: Props) {
    const data = [
        { name: "Critical", value: critical, color: COLORS.critical },
        { name: "Low", value: low, color: COLORS.low },
        { name: "Adequate", value: adequate, color: COLORS.adequate },
    ].filter(d => d.value > 0);

    if (total === 0 || data.length === 0) {
        return (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No stock status data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent = 0 }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} items`} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}