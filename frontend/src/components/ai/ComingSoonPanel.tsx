import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  icon: LucideIcon;
  title: string;
}

export default function ComingSoonPanel({ icon: Icon, title }: Props) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">{title} is wired up structurally, not yet to data</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            This page, its route, and its permission check are ready. It needs its backend
            endpoint's contract (response shape, fields, filters) before it can be connected —
            share that Swagger doc and this panel becomes a real dashboard.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
