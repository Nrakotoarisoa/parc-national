import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-muted", className)} {...props}>
      <span className="absolute inset-y-0 -left-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/45 to-transparent dark:via-white/10" />
    </div>
  );
}
