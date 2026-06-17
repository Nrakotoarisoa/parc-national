import { NavLink, Outlet } from "react-router-dom";
import { ArrowLeft, CalendarCheck, Leaf, Map, MessageSquare, Route } from "lucide-react";
import { routes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Zones", to: `${routes.admin}#zones`, icon: Map },
  { label: "Activités", to: `${routes.admin}#activites`, icon: Route },
  { label: "Réservations", to: `${routes.admin}#reservations`, icon: CalendarCheck },
  { label: "Avis", to: `${routes.admin}#avis`, icon: MessageSquare },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Leaf className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold">Parc Admin</p>
              <p className="text-xs text-stone-500">Gestion simple du parc</p>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            
            <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-full whitespace-nowrap">
              <NavLink to={routes.home} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à l'espace client
              </NavLink>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
