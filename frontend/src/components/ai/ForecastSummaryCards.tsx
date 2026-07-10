import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  PackageX,
  Clock,
  RotateCcw,
} from "lucide-react";
import type { ForecastSummary } from "./forecastAnalytics";

interface Props {
  summary: ForecastSummary;
}

export default function ForecastSummaryCards({ summary }: Props) {
  const cards = [
    {
      label: "Batches Analyzed",
      value: summary.totalBatches.toLocaleString(),
      caption: `${summary.uniqueMedicines} unique medicines`,
      icon: Package,
      tone: "text-foreground bg-muted",
    },
    {
      label: "Predicted Demand (30d)",
      value: summary.totalPredictedDemand.toLocaleString(),
      caption: `${summary.highDemandCount} batches in high demand`,
      icon: TrendingUp,
      tone: "text-blue-700 bg-blue-100",
    },
    {
      label: "Reorder Now",
      value: summary.reorderNowCount.toLocaleString(),
      caption: "Batches flagged for urgent restock",
      icon: RotateCcw,
      tone: "text-red-700 bg-red-100",
    },
    {
      label: "Critical / Out of Stock",
      value: (summary.criticalStockCount + summary.outOfStockCount).toLocaleString(),
      caption: `${summary.outOfStockCount} fully out of stock`,
      icon: PackageX,
      tone: "text-red-700 bg-red-100",
    },
    {
      label: "Expiring Soon",
      value: summary.expiringSoonCount.toLocaleString(),
      caption: "Within the next 90 days",
      icon: Clock,
      tone: "text-amber-700 bg-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.tone}`}>
                <card.icon className="h-4.5 w-4.5" />
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold leading-tight">{card.value}</p>
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{card.caption}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
