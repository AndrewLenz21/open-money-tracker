import { cn } from "@shared/lib/utils";
import { formatCurrency, formatDate } from "@shared/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu";
import type { CategorizedTransaction } from "../../types/dashboard.types";
import type { CategoryRuleMatchType, UserCategory } from "@modules/categories";
import { CategoryBadge } from "../shared/CategoryBadge";
import { StatusBadge } from "../shared/StatusBadge";
import { CategorySelector } from "./CategorySelector";

interface TransactionsTableProps {
  transactions: CategorizedTransaction[];
  packageSelected: boolean;
  categories: UserCategory[];
  showFeeColumn: boolean;
  isExcluded: (transactionKey: string) => boolean;
  onToggleExcluded: (transactionKey: string) => void;
  onCategoryChange: (
    transaction: CategorizedTransaction,
    value: string | null,
  ) => void;
  onCreateCategory: (name: string, color: string) => { ok: true; categoryId: string } | { ok: false; error: string };
  onCreateRule: (transaction: CategorizedTransaction, matchType: CategoryRuleMatchType) => void;
  t: (path: string) => string;
}

export function TransactionsTable({
  transactions,
  packageSelected,
  categories,
  showFeeColumn,
  isExcluded,
  onToggleExcluded,
  onCategoryChange,
  onCreateCategory,
  onCreateRule,
  t,
}: TransactionsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/70">
      <table className="min-w-[900px] w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur">
          <tr className="border-b border-border/70">
            <th className="w-10 px-2 py-3 text-left" />
            {[
              t("table.date") || "Date",
              t("table.description") || "Merchant / Description",
              t("table.category") || "Category",
              t("table.amount") || "Amount",
              showFeeColumn ? t("table.fee") || "Fee" : null,
              t("table.state") || "Status",
            ].filter(Boolean).map((label) => (
              <th
                key={label}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.transactionKey} className={cn("border-b border-border/50 transition-colors hover:bg-muted/30", isExcluded(tx.transactionKey) && "opacity-50")}>
              <td className="px-2 py-3">
                <input
                  type="checkbox"
                  checked={!isExcluded(tx.transactionKey)}
                  onChange={() => onToggleExcluded(tx.transactionKey)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                  aria-label={isExcluded(tx.transactionKey) ? "Include in calculations" : "Exclude from calculations"}
                />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                {formatDate(tx.paymentDate)}
              </td>
              <td className="px-4 py-3">
                <div className="max-w-[320px] min-w-0">
                  <p className="truncate font-medium text-foreground" title={tx.merchant}>
                    {tx.merchant}
                  </p>
                  <p className="truncate text-xs text-muted-foreground" title={tx.originalDescription}>
                    {tx.originalDescription}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="space-y-2">
                  <CategorySelector
                    value={tx.categoryId}
                    categories={categories}
                    disabled={!packageSelected}
                    onChange={(value) => onCategoryChange(tx, value)}
                    onCreateCategory={onCreateCategory}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryBadge name={tx.categoryName} color={tx.categoryColor} icon={tx.categoryIcon} isUncategorized={tx.isUncategorized} />
                    {packageSelected && tx.categoryId ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-7 rounded-md px-2 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground">
                          Create rule
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="min-w-[220px]">
                          <DropdownMenuItem onClick={() => onCreateRule(tx, "merchant-exact")}>Exact merchant match</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onCreateRule(tx, "description-exact")}>Exact description</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onCreateRule(tx, "description-contains")}>Description contains</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onCreateRule(tx, "description-starts-with")}>Description starts with</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </div>
                </div>
              </td>
              <td
                className={cn(
                  "px-4 py-3 font-medium tabular-nums",
                  tx.amount >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400",
                )}
              >
                {formatCurrency(tx.amount, tx.currency)}
              </td>
              {showFeeColumn ? (
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {tx.fee > 0 ? formatCurrency(tx.fee, tx.currency) : "-"}
                </td>
              ) : null}
              <td className="px-4 py-3">
                <StatusBadge state={tx.state} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}