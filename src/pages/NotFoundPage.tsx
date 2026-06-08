import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants";

export function NotFoundPage() {
  return (
    <section className="container grid min-h-screen place-items-center py-10 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">404</p>
        <h1 className="mt-3 text-4xl font-bold">Page introuvable</h1>
        <p className="mt-3 text-muted-foreground">La page demandée n'existe pas ou a été déplacée.</p>
        <Button asChild className="mt-6">
          <Link to={routes.home}>Retour à l'accueil</Link>
        </Button>
      </div>
    </section>
  );
}
