"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Download } from "lucide-react";
import type { ForecastItem } from "@/types/aiForecast";
import {
  ConfidenceBadge,
  DemandStatusBadge,
  StockHealthBadge,
  RecommendationBadge,
  ExpiryCell,
} from "./ForecastBadges";
import { useForecastStore } from "@/store/aiForecast.store";

interface Props {
  items: ForecastItem[]; // full filtered dataset (client-paginated inside)
}

type SortKey = "medicine_name" | "predicted_total_sales_next_30_days" | "current_stock" | "expiry_date";
type SortDir = "asc" | "desc";

function exportCsv(rows: ForecastItem[]) {
  const header = [
    "Medicine",
    "Batch No",
    "Predicted Sales (30d)",
    "Current Stock",
    "Demand Status",
    "Confidence",
    "Expiry Date",
    "Recommendation",
  ];
  const lines = rows.map((r) =>
    [
      r.medicine_name,
      r.batch_no,
      r.predicted_total_sales_next_30_days,
      r.current_stock,
      r.demand_status,
      r.confidence_interval,
      r.expiry_date,
      `"${r.reorder_recommendation.replace(/"/g, '""')}"`,
    ].join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `demand-forecast-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ForecastTable({ items }: Props) {
  const { clientPage, clientPageSize, setClientPage, setClientPageSize } = useForecastStore();
  const [sortKey, setSortKey] = useState<SortKey>("predicted_total_sales_next_30_days");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [items, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / clientPageSize));
  const page = Math.min(clientPage, totalPages);
  const pageItems = sorted.slice((page - 1) * clientPageSize, page * clientPageSize);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <TableHead>
      <button
        className="flex items-center gap-1 font-medium hover:text-foreground"
        onClick={() => toggleSort(sortKeyName)}
      >
        {label}
        <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
      </button>
    </TableHead>
  );

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <Button variant="outline" size="sm" onClick={() => exportCsv(sorted)}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <SortHeader label="Medicine" sortKeyName="medicine_name" />
              <TableHead>Batch No</TableHead>
              <SortHeader label="Predicted Sales (30d)" sortKeyName="predicted_total_sales_next_30_days" />
              <SortHeader label="Current Stock" sortKeyName="current_stock" />
              <TableHead>Demand Status</TableHead>
              <TableHead>Stock Health</TableHead>
              <SortHeader label="Expiry Date" sortKeyName="expiry_date" />
              <TableHead>Confidence</TableHead>
              <TableHead className="min-w-[220px]">Recommendation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((item) => (
              <TableRow key={`${item.medicine_id}-${item.batch_no}`}>
                <TableCell className="font-medium">{item.medicine_name}</TableCell>
                <TableCell className="text-muted-foreground">{item.batch_no}</TableCell>
                <TableCell>{item.predicted_total_sales_next_30_days.toLocaleString()}</TableCell>
                <TableCell>{item.current_stock.toLocaleString()}</TableCell>
                <TableCell>
                  <DemandStatusBadge value={item.demand_status} />
                </TableCell>
                <TableCell>
                  <StockHealthBadge item={item} />
                </TableCell>
                <TableCell>
                  <ExpiryCell expiryDate={item.expiry_date} />
                </TableCell>
                <TableCell>
                  <ConfidenceBadge value={item.confidence_interval} />
                </TableCell>
                <TableCell>
                  <RecommendationBadge text={item.reorder_recommendation} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Showing {(page - 1) * clientPageSize + 1}–{Math.min(page * clientPageSize, sorted.length)} of{" "}
            {sorted.length}
          </span>
          <Select value={String(clientPageSize)} onValueChange={(v) => setClientPageSize(Number(v))}>
            <SelectTrigger className="h-8 w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClientPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClientPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
