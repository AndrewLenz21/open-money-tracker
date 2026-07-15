import { TransactionCategorySelector } from "@modules/categories";
import type { UserCategory } from "@modules/categories";

interface CategorySelectorProps {
  value: string | null;
  categories: UserCategory[];
  disabled: boolean;
  onChange: (value: string | null) => void;
  onCreateCategory: (name: string, color: string) => { ok: true; categoryId: string } | { ok: false; error: string };
}

export function CategorySelector({
  value,
  categories,
  disabled,
  onChange,
  onCreateCategory,
}: CategorySelectorProps) {
  return (
    <TransactionCategorySelector
        value={value}
        categories={categories}
        disabled={disabled}
        onChange={onChange}
        onCreateCategory={onCreateCategory}
      />
  );
}
