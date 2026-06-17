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
