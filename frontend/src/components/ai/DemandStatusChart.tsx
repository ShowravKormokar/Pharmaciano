"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartDatum } from "./forecastAnalytics";

const COLORS: Record<string, string> = {
  "High Demand": "#2563eb",
  "Moderate Demand": "#7c3aed",
  "Low Demand": "#94a3b8",
};

export default function DemandStatusChart({ data }: { data: ChartDatum[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Demand Status Mix</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            No data for the current filters
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }: any) => `${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] ?? "#cbd5e1"} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [`${value ?? 0} batches`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}