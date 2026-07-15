import { useState } from "react";
import { EllipsisVertical, Copy, Trash2 } from "lucide-react";
import { Badge } from "@shared/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu";
import { cn } from "@shared/lib/utils";

interface CategoryPackageListItemProps {
  name: string;
  description: string | undefined;
  categoryCount: number;
  usageCount: number;
  selected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function CategoryPackageListItem({
  name,
  description,
  categoryCount,
  usageCount,
  selected,
  onSelect,
  onDuplicate,
  onDelete,
}: CategoryPackageListItemProps) {
  const [deleting, setDeleting] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all",
        selected
          ? "border-primary/60 bg-primary/[0.07] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]"
          : "border-border/60 bg-card/80 hover:border-border hover:bg-muted/20",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        {description ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
        ) : null}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
            {categoryCount} categories
          </Badge>
          {usageCount > 0 ? (
            <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium">
              {usageCount} imports
            </Badge>
          ) : null}
        </div>
      </div>

      <div
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            const btn = event.currentTarget.querySelector("button");
            btn?.blur();
          }
        }}
        className="shrink-0"
      >
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition hover:bg-accent hover:text-foreground group-hover:opacity-100 focus:opacity-100">
            <EllipsisVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-3.5 w-3.5" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleting(true)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {deleting ? (
        <div className="absolute inset-0 z-10 flex items-center gap-2 rounded-xl bg-background/95 px-4 backdrop-blur-sm">
          <p className="flex-1 text-xs text-foreground">Delete this package?</p>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
              setDeleting(false);
            }}
            className="inline-flex h-7 items-center rounded-md bg-destructive px-2.5 text-xs font-medium text-destructive-foreground transition hover:bg-destructive/90"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setDeleting(false);
            }}
            className="inline-flex h-7 items-center rounded-md border border-border/70 bg-background px-2.5 text-xs font-medium text-foreground transition hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      ) : null}
    </button>
  );
}