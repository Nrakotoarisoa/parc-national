import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error";

type ToastMessage = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
  actionLabel?: string;
  action?: () => void;
};

type ToastContextValue = {
  toast: (options: Omit<ToastMessage, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

const variantStyles: Record<ToastVariant, string> = {
  default: "border border-border bg-card text-card-foreground",
  success: "border border-emerald-200 bg-emerald-50 text-emerald-950",
  error: "border border-destructive bg-destructive/10 text-destructive-foreground",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<ToastMessage[]>([]);

  const toast = React.useCallback((options: Omit<ToastMessage, "id">) => {
    const id = Date.now() + Math.round(Math.random() * 1000);
    setMessages((current) => [...current, { id, ...options }]);
    window.setTimeout(() => {
      setMessages((current) => current.filter((message) => message.id !== id));
    }, 4500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-[360px] flex-col gap-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "pointer-events-auto overflow-hidden rounded-3xl border p-4 shadow-lg",
              variantStyles[message.variant],
            )}
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{message.title}</p>
                {message.description ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{message.description}</p> : null}
              </div>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-white/80 hover:text-foreground"
                onClick={() => setMessages((current) => current.filter((item) => item.id !== message.id))}
                aria-label="Fermer la notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {message.actionLabel && message.action ? (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={message.action}>
                  {message.actionLabel}
                </Button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
