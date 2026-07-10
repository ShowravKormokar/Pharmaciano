import { Card, CardContent } from "@/components/ui/card";
import { CalendarRange, Building2, MapPin, Filter, Info } from "lucide-react";
import type { ForecastMeta } from "@/types/aiForecast";

interface Props {
  meta: ForecastMeta;
  lastUpdated: Date | null;
  truncated: boolean;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ForecastMetaBar({ meta, lastUpdated, truncated }: Props) {
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4 text-sm">
        <span className="flex items-center gap-1.5">
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Analyzed:</span> {formatDate(meta.analyzedFrom)} – {formatDate(meta.analyzedTo)}
        </span>

        {meta.organizationId && (
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Organization:</span> {meta.organizationId}
          </span>
        )}

        {meta.branchId && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Branch:</span> {meta.branchId}
          </span>
        )}

        <span className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Filter:</span> {meta.filterApplied}
        </span>

        {lastUpdated && (
          <span className="ml-auto flex items-center gap-1.5 text-muted-foreground" title="Forecasts are cached for up to 1 hour — Refresh may return the same result within that window.">
            <Info className="h-3.5 w-3.5" />
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}

        {truncated && (
          <span className="w-full text-xs text-amber-700">
            Showing the first 500 matching records for charts and summary — narrow your filters for full precision on very large result sets.
          </span>
        )}
      </CardContent>
    </Card>
  );
}
