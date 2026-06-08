import { Link, Outlet } from "react-router-dom";
import { BarChart3, Leaf, Map, Route } from "lucide-react";
import { routes } from "@/lib/constants";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/40 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b px-5 font-bold">
          <Leaf className="h-5 w-5 text-primary" />
          Back office
        </div>
        <nav className="grid gap-1 p-3 text-sm">
          <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted" to={routes.admin}>
            <BarChart3 className="h-4 w-4" />
            Tableau de bord
          </Link>
          <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted" to="/admin/zones">
            <Map className="h-4 w-4" />
            Zones
          </Link>
          <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted" to="/admin/activites">
            <Route className="h-4 w-4" />
            Activités
          </Link>
        </nav>
      </aside>
      <main className="p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
