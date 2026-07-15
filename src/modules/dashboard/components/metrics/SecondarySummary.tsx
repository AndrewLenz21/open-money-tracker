import { Badge } from "@shared/components/ui";
import { formatCurrency, formatDate, formatNumber } from "@shared/utils";
import { SectionCard } from "../shared/SectionCard";

interface SecondarySummaryProps {
  currency: string;
  transactionCount: number;
  dateRange: { from: Date; to: Date } | null;
  totalFees: number;
  uncategorizedCount: number;
  t: (path: string) => string;
}

export function SecondarySummary({
  currency,
  transactionCount,
  dateRange,
  totalFees,
  uncategorizedCount,
  t,
}: SecondarySummaryProps) {
  const items = [
    {
      label: t("summary.transactionCount") || "Transactions",
      value: formatNumber(transactionCount),
    },
    {
      label: t("summary.dateRange") || "Period",
      value: dateRange
        ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
        : "-",
    },
    {
      label: t("summary.totalFees") || "Total Fees",
      value: formatCurrency(totalFees, currency),
    },
    {
      label: t("summary.currency") || "Currency",
      value: currency,
    },
  ];

  return (
    <SectionCard
      title={t("summary.secondaryTitle") || "Analysis Summary"}
      action={
        <Badge variant={uncategorizedCount > 0 ? "warning" : "secondary"}>
          {uncategorizedCount} {t("summary.uncategorized") || "uncategorized"}
        </Badge>
      }
      contentClassName="pt-0"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border/60 bg-muted/25 px-4 py-3"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
