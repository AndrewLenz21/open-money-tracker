import { Select } from "@shared/components/ui";

interface RowsPerPageSelectorProps {
  value: number;
  onChange: (value: number) => void;
  t: (path: string) => string;
}

const OPTIONS = [5, 10, 20, 50, 100];

export function RowsPerPageSelector({ value, onChange, t }: RowsPerPageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap">{t("pagination.rowsPerPage") || "Rows per page"}</span>
      <Select
        value={String(value)}
        onChange={(event) => onChange(Number(event.target.value))}
        options={OPTIONS.map((item) => ({ value: String(item), label: `${item}` }))}
        className="h-8 w-16 text-xs"
        aria-label="Rows per page"
      />
    </div>
  );
}