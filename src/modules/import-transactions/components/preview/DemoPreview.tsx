import { BarChart3, Sparkles } from "lucide-react";
import { Button } from "@shared/components/ui";

type DemoPreviewProps = {
  title: string;
  description: string;
  actionLabel: string;
  onTryDemo: () => void;
};

const ROWS = [
  { date: "May 7", description: "Salary", category: "Uncategorized", amount: "+€2,100" },
  { date: "May 6", description: "Grocery Store", category: "Uncategorized", amount: "-€78" },
  { date: "May 8", description: "Restaurant Dinner", category: "Uncategorized", amount: "-€62" },
  { date: "May 4", description: "Amazon Purchase", category: "Uncategorized", amount: "-€45" },
];

export function DemoPreview({ title, description, actionLabel, onTryDemo }: DemoPreviewProps) {
  return (
    <section className="rounded-2xl border border-border/50 bg-card/40 p-4 shadow-sm backdrop-blur-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
          <p className="max-w-xl text-xs text-muted-foreground sm:text-sm">{description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onTryDemo} className="w-fit gap-2">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {actionLabel}
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
        <div className="overflow-hidden rounded-lg border border-border/50 bg-background/45">
          {ROWS.map((row) => (
            <div key={`${row.date}-${row.description}`} className="grid grid-cols-[64px_1fr_auto] items-center gap-2 border-b px-3 py-2 text-xs last:border-0">
              <span className="text-muted-foreground">{row.date}</span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-foreground">{row.description}</span>
                <span className="block truncate text-[10px] text-muted-foreground">{row.category}</span>
              </span>
              <span className={row.amount.startsWith("+") ? "font-mono text-emerald-600 dark:text-emerald-400" : "font-mono text-rose-600 dark:text-rose-400"}>
                {row.amount}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-end gap-2 rounded-lg border border-border/50 bg-background/45 p-3" aria-hidden="true">
          {[52, 78, 38, 64, 44].map((height, i) => (
            <span
              key={height}
              className="anim-bar-grow flex-1 rounded-t bg-primary/45"
              style={{ height: `${height}%`, ["--bar-delay" as string]: `${120 + i * 60}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
