import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";
import { PageTransition } from "@/components/layout/PageTransition";
import { ZoneCard } from "@/features/zones/components/ZoneCard";
import { useGetZonesQuery } from "@/features/zones/api/zonesApi";

export function ZonesPage() {
  const { data: zones, isError, isLoading, refetch } = useGetZonesQuery();

  return (
    <PageTransition>
      <section className="container py-10">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold">Zones à découvrir</h1>
          <p className="mt-3 text-muted-foreground">
            Parcourez les espaces du parc par disponibilité, paysage et potentiel d'expérience.
          </p>
        </div>
        {isLoading ? <LoadingGrid /> : null}
        {isError ? <ErrorState onRetry={refetch} /> : null}
        {zones ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => (
              <ZoneCard key={zone.id_zone} zone={zone} />
            ))}
          </div>
        ) : null}
      </section>
    </PageTransition>
  );
}
