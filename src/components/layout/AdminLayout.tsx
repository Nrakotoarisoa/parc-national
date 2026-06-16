import { NavLink, Outlet } from "react-router-dom";
import { CalendarCheck, Leaf, Map, MessageSquare, Route } from "lucide-react";
import { routes } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
          <nav className="flex gap-1 overflow-x-auto text-sm" aria-label="Navigation administrateur">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-2 rounded-xl bg-transparent px-3 py-2 font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900",
                    isActive && "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
