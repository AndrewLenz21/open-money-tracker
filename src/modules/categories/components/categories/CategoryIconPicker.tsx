import { cn } from "@shared/lib/utils";
import {
  ShoppingCart,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Home,
  Tv,
  Gamepad2,
  Heart,
  Plane,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const ICONS: { key: string; icon: LucideIcon; label: string }[] = [
  { key: "shopping-cart", icon: ShoppingCart, label: "Shopping" },
  { key: "food", icon: UtensilsCrossed, label: "Food" },
  { key: "car", icon: Car, label: "Transport" },
  { key: "bag", icon: ShoppingBag, label: "Bag" },
  { key: "home", icon: Home, label: "Home" },
  { key: "tv", icon: Tv, label: "Entertainment" },
  { key: "gamepad", icon: Gamepad2, label: "Gaming" },
  { key: "heart", icon: Heart, label: "Health" },
  { key: "plane", icon: Plane, label: "Travel" },
  { key: "wallet", icon: Wallet, label: "Wallet" },
];

const iconMap = new Map<string, LucideIcon>();
for (const item of ICONS) {
  iconMap.set(item.key, item.icon);
}

export function getCategoryIcon(iconKey: string | undefined): LucideIcon | null {
  if (!iconKey) return null;
  return iconMap.get(iconKey) ?? null;
}

interface CategoryIconPickerProps {
  value: string;
  color: string;
  onChange: (iconKey: string) => void;
}

export function CategoryIconPicker({ value, color, onChange }: CategoryIconPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {ICONS.map(({ key, icon: Icon, label }) => {
        const isSelected = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            title={label}
            className={cn(
              "flex h-9 w-full items-center justify-center rounded-lg border transition-all",
              isSelected
                ? "border-transparent shadow-[inset_0_0_0_1.5px] text-white"
                : "border-border/60 text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground",
            )}
            style={
              isSelected
                ? { borderColor: color, backgroundColor: `${color}1A`, color, boxShadow: `inset 0 0 0 1.5px ${color}` }
                : undefined
            }
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onChange("")}
        title="No icon"
        className={cn(
          "flex h-9 w-full items-center justify-center rounded-lg border text-xs transition-all",
          !value
            ? "border-transparent shadow-[inset_0_0_0_1.5px]"
            : "border-border/60 text-muted-foreground hover:border-border hover:bg-accent",
        )}
        style={
          !value
            ? { borderColor: color, color, boxShadow: `inset 0 0 0 1.5px ${color}` }
            : undefined
        }
      >
        -
      </button>
    </div>
  );
}