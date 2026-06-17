import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DialogProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function Dialog({ children, open, onOpenChange }: DialogProps) {
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onOpenChange, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-earth-night/70 backdrop-blur-sm" aria-label="Fermer" onClick={() => onOpenChange(false)} />
      {children}
    </div>
  );
}

export const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border bg-card p-6 text-card-foreground shadow-soft", className)}
      {...props}
    >
      {children}
    </div>
  ),
);
DialogContent.displayName = "DialogContent";

export const AlertDialog = Dialog;
export const AlertDialogContent = DialogContent;

export function DialogClose({ onClick }: { onClick: () => void }) {
  return (
    <Button className="absolute right-4 top-4" size="icon" variant="ghost" aria-label="Fermer" onClick={onClick}>
      <X className="h-4 w-4" />
    </Button>
  );
}
