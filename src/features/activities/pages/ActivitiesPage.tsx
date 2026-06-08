import { ActivityCard } from "@/features/activities/components/ActivityCard";
import { useGetActivitiesQuery } from "@/features/activities/api/activitiesApi";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";

export function ActivitiesPage() {
  const { data: activities, isError, isLoading, refetch } = useGetActivitiesQuery();

  return (
    <section className="container py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold">Activités populaires</h1>
        <p className="mt-3 text-muted-foreground">
          Comparez les expériences du parc avec prix, description et accès rapide à la réservation.
        </p>
      </div>
      {isLoading ? <LoadingGrid /> : null}
      {isError ? <ErrorState onRetry={refetch} /> : null}
      {activities ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id_activite} activity={activity} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
