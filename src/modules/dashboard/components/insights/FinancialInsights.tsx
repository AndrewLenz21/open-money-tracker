import { formatCurrency } from "@shared/utils";
import { SectionCard } from "../shared/SectionCard";

interface FinancialInsightsProps {
  currency: string;
  averageDailySpending: number;
  uncategorizedCount: number;
  highestSpendingCategory: { label: string; amount: number } | null;
  largestExpense: { merchant: string; amount: number } | null;
  mostFrequentMerchant: { merchant: string; count: number } | null;
  t: (path: string) => string;
}

export function FinancialInsights({
  currency,
  averageDailySpending,
  uncategorizedCount,
  highestSpendingCategory,
  largestExpense,
  mostFrequentMerchant,
  t,
}: FinancialInsightsProps) {
  const items = [
    {
      label: t("insights.highestCategory") || "Highest spending category",
      value: highestSpendingCategory ? highestSpendingCategory.label : "-",
      help: highestSpendingCategory
        ? formatCurrency(highestSpendingCategory.amount, currency)
        : undefined,
    },
    {
      label: t("insights.largestExpense") || "Largest expense",
      value: largestExpense?.merchant || "-",
      help: largestExpense
        ? formatCurrency(Math.abs(largestExpense.amount), currency)
        : undefined,
    },
    {
      label: t("insights.averageDailySpending") || "Average daily spending",
      value: formatCurrency(averageDailySpending, currency),
      help: t("insights.averageDailySpendingHelp") || "Based on the visible period",
    },
    {
      label: t("insights.mostFrequentMerchant") || "Most frequent merchant",
      value: mostFrequentMerchant?.merchant || "-",
      help: mostFrequentMerchant
        ? `${mostFrequentMerchant.count}x`
        : `${uncategorizedCount} ${t("summary.uncategorized") || "uncategorized"}`,
    },
  ];

  return (
    <SectionCard
      title={t("insights.title") || "Financial Insights"}
      description={
        t("insights.description") ||
        "Fast signals to understand spending behavior at a glance."
      }
      contentClassName="pt-0"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-border/60 bg-muted/25 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
            {item.help ? <p className="mt-1 text-xs text-muted-foreground">{item.help}</p> : null}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
