import { cn } from "@shared/lib/utils";
import { formatCurrency } from "@shared/utils";

interface AmountDisplayProps {
  amount: number;
  currency: string;
  emphasize?: boolean;
}

export function AmountDisplay({
  amount,
  currency,
  emphasize = false,
}: AmountDisplayProps) {
  return (
    <span
      className={cn(
        "tabular-nums",
        emphasize && "text-xl sm:text-2xl font-semibold tracking-tight",
        amount > 0 && "text-emerald-600 dark:text-emerald-400",
        amount < 0 && "text-rose-600 dark:text-rose-400",
        amount === 0 && "text-foreground",
      )}
    >
      {formatCurrency(amount, currency)}
    </span>
  );
}
