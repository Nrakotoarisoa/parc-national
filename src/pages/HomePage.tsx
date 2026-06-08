import { Link } from "react-router-dom";
import { Compass, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageTransition } from "@/components/layout/PageTransition";
import { routes } from "@/lib/constants";

const trustSignals = [
  { icon: ShieldCheck, label: "Réservations sécurisées" },
  { icon: Star, label: "Avis visiteurs vérifiés" },
  { icon: Compass, label: "Exploration par zones" },
];

export function HomePage() {
  return (
    <PageTransition>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-foreground text-white">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"
          alt="Paysage naturel verdoyant du parc"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-foreground" />
        <div className="container relative grid min-h-[calc(100vh-4rem)] content-center pb-20 pt-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Expériences nature, guides locaux et activités réservables
            </div>
            <h1 className="text-4xl font-bold tracking-normal sm:text-5xl lg:text-6xl">Parc National</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/86">
              Explorez les zones protégées, comparez les activités, consultez les avis et réservez une immersion
              adaptée à votre rythme.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to={routes.zones}>Explorer les zones</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to={routes.activities}>Voir les activités</Link>
              </Button>
            </div>
          </div>
          <div className="mt-14 grid gap-3 sm:grid-cols-3">
            {trustSignals.map(({ icon: Icon, label }) => (
              <Card key={label} className="border-white/20 bg-white/12 text-white backdrop-blur">
                <CardContent className="flex items-center gap-3 p-4">
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
