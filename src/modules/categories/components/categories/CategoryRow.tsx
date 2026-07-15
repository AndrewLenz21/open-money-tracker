import { GripVertical, Pencil, Archive, RotateCcw, Trash2, type LucideIcon } from "lucide-react";
import { Badge } from "@shared/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu";
import type { UserCategory } from "../../types/categories.types";
import { getCategoryIcon } from "./CategoryIconPicker";

interface CategoryRowProps {
  category: UserCategory;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onEdit: () => void;
  onMove: (direction: "up" | "down") => void;
  onArchive: () => void;
  onDelete: () => void;
  onDragStart: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  isDragging: boolean;
  isDropTarget: boolean;
}

export function CategoryRow({
  category,
  canMoveUp,
  canMoveDown,
  onEdit,
  onMove,
  onArchive,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  isDropTarget,
}: CategoryRowProps) {
  const IconComp: LucideIcon | null = category.icon ? getCategoryIcon(category.icon) : null;

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        onDragStart(event);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        onDragOver(event);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(event);
      }}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all ${
        isDragging
          ? "border-primary/50 bg-primary/[0.06] opacity-60 shadow-sm"
          : isDropTarget
            ? "border-primary/40 bg-primary/[0.04]"
            : "border-border/60 bg-card/80 hover:border-border hover:bg-muted/15"
      } ${category.isArchived ? "opacity-55" : ""}`}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="flex h-7 w-5 cursor-grab items-center justify-center text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
        tabIndex={-1}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Icon with color */}
      <button
        type="button"
        onClick={onEdit}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/60 transition hover:border-border hover:brightness-110 hover:ring-1 hover:ring-ring/30"
        style={{ backgroundColor: `${category.color}22` }}
        title="Edit category"
      >
        {IconComp ? <IconComp className="h-3.5 w-3.5" style={{ color: category.color }} /> : null}
      </button>

      {/* Name */}
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
        {category.name}
      </span>

      {/* Archived badge */}
      {category.isArchived ? (
        <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium">Archived</Badge>
      ) : null}

      {/* Up / Down arrows */}
      <div className="flex shrink-0">
        <button
          type="button"
          disabled={!canMoveUp}
          onClick={() => onMove("up")}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 transition hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Move up"
        >
          <ChevronUpIcon />
        </button>
        <button
          type="button"
          disabled={!canMoveDown}
          onClick={() => onMove("down")}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 transition hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Move down"
        >
          <ChevronDownIcon />
        </button>
      </div>

      {/* Actions menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 transition hover:bg-accent hover:text-foreground">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
            <circle cx="8" cy="3" r="1.5" fill="currentColor" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="8" cy="13" r="1.5" fill="currentColor" />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px]">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onArchive}>
            {category.isArchived ? (
              <><RotateCcw className="mr-2 h-3.5 w-3.5" /> Restore</>
            ) : (
              <><Archive className="mr-2 h-3.5 w-3.5" /> Archive</>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}