import { formatCurrency } from "@shared/utils";
import type { CategorySpendingPoint } from "../../types/dashboard.types";
import { SectionCard } from "../shared/SectionCard";

interface CategorySpendingChartProps {
  data: CategorySpendingPoint[];
  currency: string;
  packageSelected: boolean;
  hasCategories: boolean;
  onManageCategories: () => void;
  t: (path: string) => string;
}

export function CategorySpendingChart({
  data,
  currency,
  packageSelected,
  hasCategories,
  onManageCategories,
  t,
}: CategorySpendingChartProps) {
  return (
    <SectionCard
      title={t("charts.spendingByCategory") || "Spending by Category"}
      description={
        t("charts.spendingByCategoryDescription") ||
        "Where most of your money is going."
      }
      contentClassName="pt-0"
    >
      {!packageSelected ? (
        <div className="py-12 text-center text-sm text-muted-foreground space-y-3">
          <p>Select a category package to analyze spending by category.</p>
          <button type="button" className="text-foreground underline underline-offset-4" onClick={onManageCategories}>Manage categories</button>
        </div>
      ) : !hasCategories ? (
        <div className="py-12 text-center text-sm text-muted-foreground space-y-3">
          <p>No categories have been created in this package.</p>
          <button type="button" className="text-foreground underline underline-offset-4" onClick={onManageCategories}>Manage categories</button>
        </div>
      ) : data.length > 0 ? (
        <div className="space-y-4">
          {data.slice(0, 8).map((item) => (
            <div key={item.categoryId ?? "uncategorized"} className="space-y-2">
              <div className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.count} {t("table.transactions") || "transactions"} · {item.percentage.toFixed(1)}%
                  </p>
                </div>
                <p className="shrink-0 font-medium tabular-nums text-foreground">
                  {formatCurrency(item.amount, currency)}
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted/70">
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: item.color,
                    width: `${Math.min(100, item.percentage)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {t("charts.noCategoryData") || "No expense data available."}
        </p>
      )}
    </SectionCard>
  );
}
