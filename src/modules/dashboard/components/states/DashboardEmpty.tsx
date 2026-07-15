import { BarChart3 } from "lucide-react";
import { Button } from "@shared/components/ui";
import { ROUTES } from "@core/routing";

interface DashboardEmptyProps {
  t: (path: string) => string;
}

export function DashboardEmpty({ t }: DashboardEmptyProps) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">
        {t("empty.title") || "No data yet"}
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {t("empty.description") ||
          "Import a Revolut CSV file to see your financial overview."}
      </p>
      <a href={ROUTES.home}>
        <Button>{t("empty.cta") || "Go to Import"}</Button>
      </a>
    </div>
  );
}
