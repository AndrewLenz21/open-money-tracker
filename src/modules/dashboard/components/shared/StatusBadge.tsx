import { Badge } from "@shared/components/ui";

interface StatusBadgeProps {
  state: string;
}

export function StatusBadge({ state }: StatusBadgeProps) {
  return (
    <Badge variant={state === "COMPLETED" ? "success" : "warning"}>
      {state}
    </Badge>
  );
}
