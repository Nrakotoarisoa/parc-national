import type { LucideIcon } from "lucide-react";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  className?: string;
};

export function EmptyState({
  actionLabel,
  className,
  icon: Icon = Compass,
  message,
  onAction,
  title,
}: EmptyStateProps) {
  return (
    <div className={cn("premium-surface rounded-xl p-8 text-center", className)}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{message}</p>
      {actionLabel && onAction ? (
        <Button className="mt-5" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
