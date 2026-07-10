import type { ForecastItem } from "@/types/aiForecast";

export type StockHealth = "out" | "critical" | "low" | "adequate" | "no-demand";

/**
 * Classify stock health using both AI-predicted demand and current stock,
 * rather than just a static number. Roughly: how many days of stock is left
 * at the predicted 30-day sales pace.
 */
export function getStockHealth(item: ForecastItem): StockHealth {
  if (item.current_stock === 0) return "out";
  if (item.predicted_total_sales_next_30_days === 0) return "no-demand";

  const dailyPace = item.predicted_total_sales_next_30_days / 30;
  const daysOfStockLeft = item.current_stock / dailyPace;

  if (daysOfStockLeft < 10) return "critical";
  if (daysOfStockLeft < 30) return "low";
  return "adequate";
}

export const STOCK_HEALTH_LABEL: Record<StockHealth, string> = {
  out: "Out of Stock",
  critical: "Critical",
  low: "Running Low",
  adequate: "Adequate",
  "no-demand": "No Recent Demand",
};

/** Days between today and the batch's expiry date (negative = already expired). */
export function daysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate).getTime();
  const now = Date.now();
  return Math.floor((expiry - now) / (1000 * 60 * 60 * 24));
}

export function isExpiringSoon(item: ForecastItem, withinDays = 90): boolean {
  const days = daysUntilExpiry(item.expiry_date);
  return days >= 0 && days <= withinDays;
}

export function isExpired(item: ForecastItem): boolean {
  return daysUntilExpiry(item.expiry_date) < 0;
}

/** Splits "Excess Stock - Consider reducing..." into a short action + detail. */
export function parseRecommendation(text: string): { action: string; detail: string } {
  const [action, ...rest] = text.split(" - ");
  return { action: action.trim(), detail: rest.join(" - ").trim() };
}

export type RecommendationTone = "urgent" | "neutral" | "positive";

export function recommendationTone(action: string): RecommendationTone {
  const lower = action.toLowerCase();
  if (lower.includes("reorder")) return "urgent";
  if (lower.includes("excess")) return "neutral";
  return "positive";
}

export interface ForecastSummary {
  totalBatches: number;
  uniqueMedicines: number;
  totalPredictedDemand: number;
  highDemandCount: number;
  moderateDemandCount: number;
  lowDemandCount: number;
  outOfStockCount: number;
  criticalStockCount: number;
  lowStockCount: number;
  expiringSoonCount: number;
  reorderNowCount: number;
}

export function summarizeForecast(items: ForecastItem[]): ForecastSummary {
  const summary: ForecastSummary = {
    totalBatches: items.length,
    uniqueMedicines: new Set(items.map((i) => i.medicine_id)).size,
    totalPredictedDemand: 0,
    highDemandCount: 0,
    moderateDemandCount: 0,
    lowDemandCount: 0,
    outOfStockCount: 0,
    criticalStockCount: 0,
    lowStockCount: 0,
    expiringSoonCount: 0,
    reorderNowCount: 0,
  };

  for (const item of items) {
    summary.totalPredictedDemand += item.predicted_total_sales_next_30_days;

    if (item.demand_status === "High Demand") summary.highDemandCount++;
    else if (item.demand_status === "Moderate Demand") summary.moderateDemandCount++;
    else if (item.demand_status === "Low Demand") summary.lowDemandCount++;

    const health = getStockHealth(item);
    if (health === "out") summary.outOfStockCount++;
    else if (health === "critical") summary.criticalStockCount++;
    else if (health === "low") summary.lowStockCount++;

    if (isExpiringSoon(item)) summary.expiringSoonCount++;

    const { action } = parseRecommendation(item.reorder_recommendation);
    if (recommendationTone(action) === "urgent") summary.reorderNowCount++;
  }

  return summary;
}

export interface ChartDatum {
  name: string;
  value: number;
}

export function demandStatusDistribution(items: ForecastItem[]): ChartDatum[] {
  return [
    { name: "High Demand", value: items.filter((i) => i.demand_status === "High Demand").length },
    { name: "Moderate Demand", value: items.filter((i) => i.demand_status === "Moderate Demand").length },
    { name: "Low Demand", value: items.filter((i) => i.demand_status === "Low Demand").length },
  ].filter((d) => d.value > 0);
}

export function stockHealthDistribution(items: ForecastItem[]): ChartDatum[] {
  const counts: Record<StockHealth, number> = {
    out: 0,
    critical: 0,
    low: 0,
    adequate: 0,
    "no-demand": 0,
  };
  items.forEach((i) => counts[getStockHealth(i)]++);

  return (Object.keys(counts) as StockHealth[])
    .map((key) => ({ name: STOCK_HEALTH_LABEL[key], value: counts[key] }))
    .filter((d) => d.value > 0);
}

export interface TopDemandDatum {
  name: string;
  fullName: string;
  batch_no: string;
  predicted: number;
  stock: number;
}

export function topPredictedDemand(items: ForecastItem[], n = 6): TopDemandDatum[] {
  return [...items]
    .sort((a, b) => b.predicted_total_sales_next_30_days - a.predicted_total_sales_next_30_days)
    .slice(0, n)
    .map((item) => ({
      name: item.medicine_name.length > 16 ? item.medicine_name.slice(0, 16) + "…" : item.medicine_name,
      fullName: item.medicine_name,
      batch_no: item.batch_no,
      predicted: item.predicted_total_sales_next_30_days,
      stock: item.current_stock,
    }));
}
