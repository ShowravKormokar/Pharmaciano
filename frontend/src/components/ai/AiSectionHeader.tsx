"use client";

import { LucideIcon, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  rightSlot?: React.ReactNode;
}

export default function AiSectionHeader({
  icon: Icon,
  title,
  subtitle,
  onRefresh,
  refreshing = false,
  rightSlot,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {rightSlot}
        {onRefresh && (
          <Button onClick={onRefresh} disabled={refreshing} variant="outline">
            <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
}
