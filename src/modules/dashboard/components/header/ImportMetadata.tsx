import { Calendar, FileText, Hash } from "lucide-react";
import { Badge } from "@shared/components/ui";
import { formatDate } from "@shared/utils";
import type { ImportRecord } from "@modules/import-transactions/domain";

interface ImportMetadataProps {
  activeImport: ImportRecord | null;
  t: (path: string) => string;
}

export function ImportMetadata({ activeImport, t }: ImportMetadataProps) {
  if (!activeImport) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <FileText className="h-3.5 w-3.5" />
        <span className="max-w-[240px] truncate font-medium text-foreground/85">
          {activeImport.filename}
        </span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(new Date(activeImport.importedAt))}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Hash className="h-3.5 w-3.5" />
        {activeImport.acceptedRows} {t("sidebar.transactions") || "transactions"}
      </span>
      <Badge variant="outline" className="h-5 px-1.5 text-[10px] uppercase">
        {activeImport.provider}
      </Badge>
    </div>
  );
}
