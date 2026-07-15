import { ArrowRight, FileCheck2, RefreshCw } from "lucide-react";
import { Button } from "@shared/components/ui";
import { Badge } from "@shared/components/ui";
import { formatCurrency, formatDate } from "@shared/utils";
import type { ImportResult, Transaction } from "@modules/import-transactions/domain";

type TransactionPreviewProps = {
  result: ImportResult;
  filename: string;
  title: string;
  description: string;
  showingLabel: string;
  dateRangeLabel: string;
  currenciesLabel: string;
  transactionsLabel: string;
  continueLabel: string;
  replaceLabel: string;
  categoryLabel: string;
  uncategorizedLabel: string;
  onContinue: () => void;
  onReplace: () => void;
  isImporting?: boolean;
};

export function TransactionPreview({
  result,
  filename,
  title,
  description,
  showingLabel,
  dateRangeLabel,
  currenciesLabel,
  transactionsLabel,
  continueLabel,
  replaceLabel,
  categoryLabel,
  uncategorizedLabel,
  onContinue,
  onReplace,
  isImporting = false,
}: TransactionPreviewProps) {
  const rows = result.transactions.slice(0, 10);
  const currencies = [...new Set(result.transactions.map((tx) => tx.currency))];
  const dates = result.transactions.map((tx) => tx.startedAt).sort((a, b) => a.getTime() - b.getTime());
  const start = dates[0];
  const end = dates[dates.length - 1];

  return (
    <section className="anim-fade-up rounded-2xl border border-border/60 bg-card/65 p-4 shadow-sm backdrop-blur-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-primary" aria-hidden="true" />
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
          </div>
          <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant="secondary" className="w-fit shrink-0 text-[10px]">
          {filename}
        </Badge>
      </div>

      <dl className="mb-4 grid gap-2 sm:grid-cols-3">
        <Meta label={transactionsLabel} value={String(result.metadata.acceptedRows)} />
        <Meta label={dateRangeLabel} value={start && end ? `${formatDate(start)} - ${formatDate(end)}` : "-"} />
        <Meta label={currenciesLabel} value={currencies.join(", ") || "-"} />
      </dl>

      <div className="overflow-x-auto rounded-lg border border-border/60 bg-background/50">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-xs text-muted-foreground">
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
              <th className="px-3 py-2 font-medium">Currency</th>
              <th className="px-3 py-2 font-medium">{categoryLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((tx: Transaction) => (
              <tr key={tx.id} className="border-b last:border-0 transition-colors hover:bg-muted/25">
                <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">{formatDate(tx.startedAt)}</td>
                <td className="max-w-[260px] truncate px-3 py-2">{tx.description}</td>
                <td className="whitespace-nowrap px-3 py-2 text-right font-mono text-xs">
                  {formatCurrency(tx.amount, tx.currency)}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{tx.currency}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{uncategorizedLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {showingLabel
            .replace("{shown}", String(rows.length))
            .replace("{total}", String(result.transactions.length))}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onReplace} className="gap-2">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {replaceLabel}
          </Button>
          <Button onClick={onContinue} disabled={isImporting} className="gap-2">
            {isImporting && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
            {continueLabel}
            {!isImporting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </Button>
        </div>
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/45 px-3 py-2">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
