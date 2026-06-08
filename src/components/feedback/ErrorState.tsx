import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Impossible de charger le contenu",
  message = "Veuillez réessayer dans quelques instants.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-lg border bg-card p-6 text-center">
      <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-destructive" aria-hidden="true" />
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button className="mt-4" variant="outline" onClick={onRetry}>
          Réessayer
        </Button>
      ) : null}
    </div>
  );
}
