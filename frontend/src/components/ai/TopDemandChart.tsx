"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopDemandDatum } from "./forecastAnalytics";

export default function TopDemandChart({ data }: { data: TopDemandDatum[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Top Predicted Demand (Next 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            No data for the current filters
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" fontSize={12} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
              {/* <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} units`,
                  name === "predicted" ? "Predicted Sales" : "Current Stock",
                ]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
              /> */}
              <Legend formatter={(v) => (v === "predicted" ? "Predicted Sales" : "Current Stock")} />
              <Bar dataKey="predicted" fill="#2563eb" radius={[0, 4, 4, 0]} />
              <Bar dataKey="stock" fill="#94a3b8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
