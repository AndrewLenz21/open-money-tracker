import { ArrowDownRight, ArrowUpRight, TrendingUp, Wallet } from "lucide-react";
import { AmountDisplay } from "../shared/AmountDisplay";
import { MetricCard } from "./MetricCard";

interface PrimaryMetricsProps {
  currency: string;
  currentBalance: number | null;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  t: (path: string) => string;
}

export function PrimaryMetrics({
  currency,
  currentBalance,
  totalIncome,
  totalExpenses,
  netCashFlow,
  t,
}: PrimaryMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={<Wallet className="h-4 w-4" />}
        label={t("summary.currentBalance") || "Current Balance"}
        value={
          currentBalance !== null ? (
            <AmountDisplay amount={currentBalance} currency={currency} emphasize />
          ) : (
            <span className="text-xl font-semibold tracking-tight text-foreground">-</span>
          )
        }
      />
      <MetricCard
        icon={<ArrowUpRight className="h-4 w-4" />}
        label={t("summary.totalIncome") || "Total Income"}
        value={<AmountDisplay amount={totalIncome} currency={currency} emphasize />}
      />
      <MetricCard
        icon={<ArrowDownRight className="h-4 w-4" />}
        label={t("summary.totalExpenses") || "Total Expenses"}
        value={<AmountDisplay amount={-totalExpenses} currency={currency} emphasize />}
      />
      <MetricCard
        icon={<TrendingUp className="h-4 w-4" />}
        label={t("summary.netCashFlow") || "Net Cash Flow"}
        value={<AmountDisplay amount={netCashFlow} currency={currency} emphasize />}
      />
    </div>
  );
}
