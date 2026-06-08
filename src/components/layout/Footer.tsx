import { Link } from "react-router-dom";
import { routes } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container grid gap-6 py-8 text-sm text-muted-foreground md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-semibold text-foreground">Parc National</p>
          <p className="mt-2 max-w-xl">
            Découverte des zones protégées, activités guidées, avis visiteurs et réservations en ligne.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4">
          <Link to={routes.zones}>Zones</Link>
          <Link to={routes.activities}>Activités</Link>
          <Link to={routes.reviews}>Avis</Link>
        </nav>
      </div>
    </footer>
  );
}
