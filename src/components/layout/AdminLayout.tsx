import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, CalendarCheck, Leaf, Map, Menu, Route, Settings, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: routes.admin, icon: BarChart3, end: true },
  { label: "Zones", to: `${routes.admin}#zones`, icon: Map },
  { label: "Activités", to: `${routes.admin}#activites`, icon: Route },
  { label: "Réservations", to: `${routes.admin}#reservations`, icon: CalendarCheck },
  { label: "Clients", to: `${routes.admin}#clients`, icon: Users },
  { label: "Paramètres", to: `${routes.admin}#settings`, icon: Settings },
];

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="grid gap-2 p-4 text-sm">
      {navItems.map(({ label, to, icon: Icon, end }) => (
        <NavLink
          key={label}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground",
              isActive && "bg-primary text-primary-foreground shadow-lift hover:bg-primary hover:text-primary-foreground",
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
    <div className="min-h-screen bg-gradient-mist lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="sticky top-0 z-40 hidden h-screen border-r bg-card/90 shadow-soft backdrop-blur-xl lg:block">
        <div className="flex h-20 items-center gap-3 border-b px-6">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-canopy text-white shadow-lift">
            <Leaf className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-xl font-bold">Parc Admin</p>
            <p className="text-xs text-muted-foreground">Operations cockpit</p>
          </div>
        </div>
        <AdminNav />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-2 font-bold">
            <Leaf className="h-5 w-5 text-primary" />
            Parc Admin
          </div>
          <Button variant="outline" size="icon" aria-label="Ouvrir la navigation administrateur" onClick={() => setIsMobileNavOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 bg-earth-night/60 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true">
            <div className="h-full w-80 max-w-[86vw] border-r bg-card shadow-premium">
              <div className="flex h-16 items-center justify-between border-b px-4">
                <div className="flex items-center gap-2 font-bold"><Leaf className="h-5 w-5 text-primary" />Parc Admin</div>
                <Button variant="ghost" size="icon" aria-label="Fermer la navigation" onClick={() => setIsMobileNavOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <AdminNav onNavigate={() => setIsMobileNavOpen(false)} />
            </div>
          </div>
        )}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
