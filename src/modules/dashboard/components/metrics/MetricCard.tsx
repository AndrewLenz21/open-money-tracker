import type { ReactNode } from "react";
import { Card, CardContent } from "@shared/components/ui";
import { cn } from "@shared/lib/utils";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  helper?: string;
  className?: string;
}

export function MetricCard({
  icon,
  label,
  value,
  helper,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("border-border/70 bg-card/95 shadow-sm", className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <div className="min-w-0">{value}</div>
          {helper ? <p className="text-xs text-muted-foreground">{helper}</p> : null}
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/40 p-2.5 text-muted-foreground">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
