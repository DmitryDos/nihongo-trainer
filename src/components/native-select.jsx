import { cn } from "@/lib/utils";

// Нативный <select> в стиле остальных контролов — надёжно и без лишних зависимостей.
export function NativeSelect({ className, ...props }) {
  return (
    <select
      className={cn(
        "h-9 rounded-lg border border-input bg-transparent px-2.5 pr-8 text-sm outline-none transition-colors",
        "hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
        className
      )}
      {...props}
    />
  );
}
