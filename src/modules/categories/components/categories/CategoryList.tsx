import { useCallback, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@shared/components/ui";
import type { UserCategory } from "../../types/categories.types";
import { CategoryRow } from "./CategoryRow";

interface CategoryListProps {
  categories: UserCategory[];
  onEdit: (category: UserCategory) => void;
  onMove: (categoryId: string, direction: "up" | "down") => void;
  onArchive: (categoryId: string, isArchived: boolean) => void;
  onDelete: (categoryId: string) => void;
  onReorder: (categoryId: string, targetIndex: number) => void;
  onCreateClick: () => void;
}

export function CategoryList({ categories, onEdit, onMove, onArchive, onDelete, onReorder, onCreateClick }: CategoryListProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const dragNode = useRef<EventTarget | null>(null);

  const handleDragStart = useCallback((categoryId: string) => (event: React.DragEvent) => {
    dragNode.current = event.target;
    setDragId(categoryId);
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((categoryId: string) => (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropTargetId(categoryId);
  }, []);

  const handleDrop = useCallback(
    (targetId: string) => (event: React.DragEvent) => {
      event.preventDefault();
      if (dragId && dragId !== targetId) {
        const targetIndex = categories.findIndex((cat) => cat.id === targetId);
        if (targetIndex >= 0) {
          onReorder(dragId, targetIndex);
        }
      }
      setDragId(null);
      setDropTargetId(null);
      dragNode.current = null;
    },
    [categories, dragId, onReorder],
  );

  const handleDragEnd = useCallback(() => {
    setDragId(null);
    setDropTargetId(null);
    dragNode.current = null;
  }, []);

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-muted/15 px-5 py-10 text-center">
        <p className="text-sm font-medium text-foreground">No categories yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Create your first category to start organizing transactions.
        </p>
        <Button size="sm" className="mt-4" onClick={onCreateClick}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Create category
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1" onDragEnd={handleDragEnd}>
      {categories.map((category, index) => (
        <CategoryRow
          key={category.id}
          category={category}
          canMoveUp={index > 0}
          canMoveDown={index < categories.length - 1}
          onEdit={() => onEdit(category)}
          onMove={(direction) => onMove(category.id, direction)}
          onArchive={() => onArchive(category.id, !category.isArchived)}
          onDelete={() => {
            if (window.confirm("Delete this category permanently? Transactions using it will become Uncategorized.")) {
              onDelete(category.id);
            }
          }}
          onDragStart={handleDragStart(category.id)}
          onDragOver={handleDragOver(category.id)}
          onDrop={handleDrop(category.id)}
          isDragging={dragId === category.id}
          isDropTarget={dropTargetId === category.id}
        />
      ))}
    </div>
  );
}