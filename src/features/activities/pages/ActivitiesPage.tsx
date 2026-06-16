import { Compass, Search, Sparkles } from "lucide-react";
import { ActivityCard } from "@/features/activities/components/ActivityCard";
import { useGetActivitiesQuery } from "@/features/activities/api/activitiesApi";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function ActivitiesPage() {
  const { data: activities, isError, isLoading, refetch } = useGetActivitiesQuery();

  return (
    <section className="bg-gradient-mist">
      <div className="container py-8 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div>
            <Badge className="mb-4 rounded-full px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Expériences recommandées
            </Badge>
            <h1 className="display-title max-w-3xl">Activités populaires à comparer avant de réserver.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Retrouvez les expériences du parc avec informations essentielles, prix, durée indicative et accès rapide à la réservation.
            </p>
          </div>
          <div className="premium-surface rounded-2xl p-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden="true" />
              <Input className="h-12 rounded-full bg-background pl-11" placeholder="Rechercher une activité, un thème..." aria-label="Rechercher une activité" />
            </label>
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Compass className="h-4 w-4 text-primary" aria-hidden="true" /> {activities?.length ?? 0} expériences disponibles
            </div>
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? <LoadingGrid /> : null}
          {isError ? <ErrorState onRetry={refetch} /> : null}
          {activities ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <ActivityCard key={activity.id_activite} activity={activity} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
