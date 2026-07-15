import { CATEGORY_COLOR_PALETTE } from "../../constants/categoryColors";
import { cn } from "@shared/lib/utils";

interface CategoryColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryColorPicker({ value, onChange }: CategoryColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_COLOR_PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "h-7 w-7 rounded-full border border-border ring-offset-background transition",
            value === color && "ring-2 ring-ring ring-offset-2",
          )}
          style={{ backgroundColor: color }}
          aria-label={`Use color ${color}`}
        />
      ))}
    </div>
  );
}
