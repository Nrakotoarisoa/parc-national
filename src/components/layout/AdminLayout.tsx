import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { CalendarCheck, Leaf, Map, Menu, MessageSquare, Route, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Zones", to: `${routes.admin}#zones`, icon: Map },
  { label: "Activités", to: `${routes.admin}#activites`, icon: Route },
  { label: "Réservations", to: `${routes.admin}#reservations`, icon: CalendarCheck },
  { label: "Avis", to: `${routes.admin}#avis`, icon: MessageSquare },
];

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="grid gap-1 p-3 text-sm" aria-label="Navigation administrateur">
      {navItems.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={label}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl bg-transparent px-3 py-2.5 font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900",
              isActive && "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700",
            )
          }
          to={to}
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AdminLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 z-40 hidden h-screen border-r border-stone-200 bg-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-stone-200 px-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <Leaf className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg font-bold">Parc Admin</p>
            <p className="text-xs text-stone-500">Gestion du parc</p>
          </div>
        </div>
        <AdminNav />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white/90 px-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2 font-bold"><Leaf className="h-5 w-5 text-emerald-600" />Parc Admin</div>
          <Button variant="outline" size="icon" aria-label="Ouvrir la navigation administrateur" onClick={() => setIsMobileNavOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        {isMobileNavOpen ? (
          <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true">
            <div className="h-full w-80 max-w-[86vw] border-r border-stone-200 bg-white shadow-2xl">
              <div className="flex h-16 items-center justify-between border-b border-stone-200 px-4">
                <div className="flex items-center gap-2 font-bold"><Leaf className="h-5 w-5 text-emerald-600" />Parc Admin</div>
                <Button variant="ghost" size="icon" aria-label="Fermer la navigation" onClick={() => setIsMobileNavOpen(false)}><X className="h-5 w-5" /></Button>
              </div>
              <AdminNav onNavigate={() => setIsMobileNavOpen(false)} />
            </div>
          </div>
        ) : null}
        <main className="p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
