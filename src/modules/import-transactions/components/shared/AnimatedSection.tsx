import * as React from "react";
import { cn } from "@shared/lib/utils";

type AnimatedSectionProps = {
  index?: number;
  delayMs?: number;
  durationMs?: number;
  variant?: "fade-up" | "fade-down" | "fade-in";
  as?: "div" | "section" | "article";
  className?: string;
  children: React.ReactNode;
};

const VARIANT_CLASS: Record<NonNullable<AnimatedSectionProps["variant"]>, string> = {
  "fade-up": "anim-fade-up",
  "fade-down": "anim-fade-down",
  "fade-in": "anim-fade-in",
};

export function AnimatedSection({
  index,
  delayMs,
  durationMs,
  variant = "fade-up",
  as = "div",
  className,
  children,
}: AnimatedSectionProps) {
  const delay = delayMs ?? (index !== undefined ? index * 120 : 0);
  const style: React.CSSProperties = {
    ["--anim-delay" as string]: `${delay}ms`,
  };
  if (durationMs !== undefined) {
    style.animationDuration = `${durationMs}ms`;
  }
  const Tag = as as keyof React.JSX.IntrinsicElements;
  return React.createElement(
    Tag,
    {
      className: cn(VARIANT_CLASS[variant], className),
      style,
    },
    children,
  );
}
