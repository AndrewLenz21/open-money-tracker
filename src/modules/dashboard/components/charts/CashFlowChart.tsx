import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@shared/utils";
import type { CashFlowPoint } from "../../types/dashboard.types";
import { SectionCard } from "../shared/SectionCard";

interface CashFlowChartProps {
  data: CashFlowPoint[];
  currency: string;
  t: (path: string) => string;
}

export function CashFlowChart({ data, currency, t }: CashFlowChartProps) {
  const formatAxisCurrency = (value: number) => {
    const sign = value < 0 ? "-" : "";
    const absolute = Math.abs(value);
    const symbol = (() => {
      try {
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency,
          currencyDisplay: "narrowSymbol",
          maximumFractionDigits: 0,
        }).formatToParts(0).find((part) => part.type === "currency")?.value ?? currency;
      } catch {
        return currency;
      }
    })();

    if (absolute >= 1000) {
      const compact = absolute / 1000;
      return `${sign}${symbol}${compact % 1 === 0 ? compact.toFixed(0) : compact.toFixed(1)}k`;
    }
    return `${sign}${symbol}${absolute.toFixed(0)}`;
  };

  return (
    <SectionCard
      title={t("charts.cashFlow") || "Cash Flow Over Time"}
      description={
        t("charts.cashFlowDescription") ||
        "Income and expenses over time with net movement."
      }
      contentClassName="pt-0"
    >
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="var(--chart-axis)" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="var(--chart-axis)"
              tickFormatter={formatAxisCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--chart-tooltip)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
              }}
              formatter={(value, name) => [
                formatCurrency(Number(value ?? 0), currency),
                String(name),
              ]}
            />
            <Bar dataKey="income" name={t("summary.totalIncome") || "Income"} fill="var(--chart-income)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" name={t("summary.totalExpenses") || "Expenses"} fill="var(--chart-expense)" radius={[6, 6, 0, 0]} />
            <Line type="monotone" dataKey="net" name={t("summary.netCashFlow") || "Net"} stroke="var(--chart-net)" strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {t("charts.noCashFlow") || "No cash flow data available."}
        </p>
      )}
    </SectionCard>
  );
}
