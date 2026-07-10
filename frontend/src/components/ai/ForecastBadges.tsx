import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from "lucide-react";
import type { ConfidenceLevel, DemandStatus, ForecastItem } from "@/types/aiForecast";
import {
  getStockHealth,
  STOCK_HEALTH_LABEL,
  isExpiringSoon,
  isExpired,
  daysUntilExpiry,
  parseRecommendation,
  recommendationTone,
} from "./forecastAnalytics";

export function ConfidenceBadge({ value }: { value: ConfidenceLevel }) {
  const styles: Record<ConfidenceLevel, string> = {
    High: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
    Medium: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    Low: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  };
  return <Badge className={styles[value] ?? ""}>{value}</Badge>;
}

export function DemandStatusBadge({ value }: { value: DemandStatus }) {
  const styles: Record<DemandStatus, string> = {
    "High Demand": "bg-blue-100 text-blue-800 hover:bg-blue-100",
    "Moderate Demand": "bg-violet-100 text-violet-800 hover:bg-violet-100",
    "Low Demand": "bg-slate-100 text-slate-700 hover:bg-slate-100",
  };
  return <Badge className={styles[value] ?? ""}>{value}</Badge>;
}

export function StockHealthBadge({ item }: { item: ForecastItem }) {
  const health = getStockHealth(item);
  const styles: Record<string, string> = {
    out: "bg-red-100 text-red-800 hover:bg-red-100",
    critical: "bg-red-100 text-red-800 hover:bg-red-100",
    low: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    adequate: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
    "no-demand": "bg-slate-100 text-slate-600 hover:bg-slate-100",
  };
  return <Badge className={styles[health]}>{STOCK_HEALTH_LABEL[health]}</Badge>;
}

export function RecommendationBadge({ text }: { text: string }) {
  const { action, detail } = parseRecommendation(text);
  const tone = recommendationTone(action);
  const styles: Record<string, string> = {
    urgent: "bg-red-100 text-red-800 hover:bg-red-100",
    neutral: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    positive: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  };
  return (
    <div className="space-y-1">
      <Badge className={styles[tone]}>{action}</Badge>
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
    </div>
  );
}

export function ExpiryCell({ expiryDate }: { expiryDate: string }) {
  const expired = isExpired({ expiry_date: expiryDate } as ForecastItem);
  const soon = isExpiringSoon({ expiry_date: expiryDate } as ForecastItem);
  const days = daysUntilExpiry(expiryDate);
  const formatted = new Date(expiryDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-1.5">
      <span>{formatted}</span>
      {expired && (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700">
          <AlertTriangle className="h-3.5 w-3.5" /> Expired
        </span>
      )}
      {!expired && soon && (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
          <Clock className="h-3.5 w-3.5" /> {days}d left
        </span>
      )}
    </div>
  );
}
