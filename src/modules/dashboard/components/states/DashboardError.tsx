import { AlertCircle } from "lucide-react";
import { Button } from "@shared/components/ui";
import { ROUTES } from "@core/routing";

interface DashboardErrorProps {
  error: string;
}

export function DashboardError({ error }: DashboardErrorProps) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">Error loading data</h2>
      <p className="text-muted-foreground mb-4">{error}</p>
      <a href={ROUTES.home}>
        <Button>Go back to import</Button>
      </a>
    </div>
  );
}
