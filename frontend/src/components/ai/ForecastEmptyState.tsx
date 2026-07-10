import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  message: string;
  onClearFilters: () => void;
}

export default function ForecastEmptyState({ message, onClearFilters }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <PackageSearch className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">No forecast data for these filters</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onClearFilters}>
        Clear filters and retry
      </Button>
    </div>
  );
}
