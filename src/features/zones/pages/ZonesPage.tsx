import { Compass, Heart, Sparkles, Trees } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";
import { PageTransition } from "@/components/layout/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetZonesQuery } from "@/features/zones/api/zonesApi";
import { ZoneCard } from "@/features/zones/components/ZoneCard";
import { ZoneExplorerControls } from "@/features/zones/components/ZoneExplorerControls";
import { useZoneExplorer } from "@/features/zones/hooks/useZoneExplorer";
import { toggleZoneFavorite } from "@/features/zones/slices/zoneFavoritesSlice";
import type { ZoneAvailabilityFilter, ZoneSort } from "@/features/zones/types";

const discoveryHighlights = [
  { icon: Trees, label: "Parcours immersifs", value: "12+" },
  { icon: Sparkles, label: "Expériences premium", value: "4.8/5" },
  { icon: Heart, label: "Favoris voyageurs", value: "1k+" },
];

export function ZonesPage() {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.zoneFavorites.ids);
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<ZoneAvailabilityFilter>("all");
  const [sort, setSort] = useState<ZoneSort>("recommended");
  const debouncedQuery = useDebounce(query, 250);
  const { data: zones, isError, isFetching, isLoading, refetch } = useGetZonesQuery({
    search: debouncedQuery,
    availability,
    sort,
  });
  const filteredZones = useZoneExplorer(zones, debouncedQuery, availability, sort);

  return (
    <PageTransition>
      <section className="relative overflow-hidden bg-gradient-mist">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-canopy opacity-15" />
        <div className="container relative py-8 sm:py-12 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <Badge className="mb-4 rounded-full px-3 py-1">Inspiré par les meilleurs guides voyageurs</Badge>
              <h1 className="display-title max-w-3xl">Zones du Parc à découvrir comme sur un carnet de voyage premium.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Recherchez, filtrez, comparez les notes, consultez les avis et gardez vos zones favorites pour préparer
                une exploration naturelle fluide, mobile-first et immersive.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button className="rounded-full" size="lg">
                  <Compass className="h-4 w-4" /> Lancer l'exploration
                </Button>
                <Button variant="outline" className="rounded-full" size="lg">
                  Voir les favoris ({favoriteIds.length})
                </Button>
              </div>
            </motion.div>
            <div className="grid grid-cols-3 gap-3">
              {discoveryHighlights.map((item) => (
                <div key={item.label} className="premium-surface rounded-3xl p-4 text-center">
                  <item.icon className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-3 text-xl font-bold">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container space-y-8 py-8 sm:py-10">
        <ZoneExplorerControls
          availability={availability}
          query={query}
          resultCount={filteredZones.length}
          sort={sort}
          onAvailabilityChange={setAvailability}
          onQueryChange={setQuery}
          onSortChange={setSort}
        />

        {isLoading ? <LoadingGrid /> : null}
        {isError ? <ErrorState onRetry={refetch} /> : null}
        {!isLoading && !isError && filteredZones.length === 0 ? (
          <EmptyState title="Aucune zone trouvée" message="Essayez un autre mot-clé ou élargissez les filtres." />
        ) : null}
        {filteredZones.length > 0 ? (
          <div className="relative">
            {isFetching ? <div className="absolute inset-x-0 top-0 z-10 h-1 animate-pulse rounded-full bg-primary/50" /> : null}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredZones.map((zone) => (
                <ZoneCard
                  key={zone.id_zone}
                  zone={zone}
                  isFavorite={favoriteIds.includes(zone.id_zone)}
                  onToggleFavorite={(zoneId) => dispatch(toggleZoneFavorite(zoneId))}
                />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </PageTransition>
  );
}
