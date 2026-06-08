import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingProps = {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function Rating({ className, max = 5, showValue = true, size = "md", value }: RatingProps) {
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const iconClassName = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-label={`Note ${normalizedValue} sur ${max}`}>
      {Array.from({ length: max }).map((_, index) => {
        const isActive = index < Math.round(normalizedValue);

        return (
          <Star
            key={index}
            className={cn(iconClassName, isActive ? "fill-accent text-accent" : "fill-muted text-muted")}
            aria-hidden="true"
          />
        );
      })}
      {showValue ? <span className="ml-1 text-sm font-bold text-foreground">{normalizedValue.toFixed(1)}</span> : null}
    </span>
  );
}
