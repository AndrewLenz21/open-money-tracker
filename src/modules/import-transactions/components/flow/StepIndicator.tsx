import { Check } from "lucide-react";
import { cn } from "@shared/lib/utils";

export type ImportStep = 1 | 2 | 3 | 4;

type StepDef = { index: 1 | 2 | 3; label: string };

type StepIndicatorProps = { steps: StepDef[]; currentStep: ImportStep; className?: string };

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <ol
      className={cn("mx-auto flex h-11 w-full max-w-2xl items-center justify-center gap-0", className)}
      aria-label="Import progress"
    >
      {steps.map((step, i) => {
        const isComplete = currentStep > step.index;
        const isActive = currentStep === step.index;
        const isPending = currentStep < step.index;
        const isLast = i === steps.length - 1;

        return (
          <li key={step.index} className="flex min-w-0 items-center gap-0">
            <span
              className="flex items-center gap-1.5"
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors duration-300",
                  isActive && "bg-primary text-primary-foreground shadow-sm",
                  isComplete && "bg-primary/20 text-primary",
                  isPending && "bg-muted/70 text-muted-foreground",
                )}
                aria-hidden="true"
              >
                {isComplete ? <Check className="h-3 w-3" /> : step.index}
              </span>
              <span
                className={cn(
                  "truncate text-xs font-medium leading-none transition-colors duration-300",
                  isActive && "text-foreground",
                  isComplete && "text-foreground",
                  isPending && "text-muted-foreground/60",
                )}
              >
                <span className="sr-only">Step {step.index}: </span>
                {step.label}
              </span>
            </span>
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  "mx-1.5 h-px w-5 shrink-0 transition-colors duration-300 sm:w-7",
                  isComplete ? "bg-primary/40" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
