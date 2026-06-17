import { Heart, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ZoneAvailabilityFilter, ZoneFavoritesFilter, ZoneSort } from "@/features/zones/types";

const availabilityOptions: Array<{ label: string; value: ZoneAvailabilityFilter }> = [
  { label: "Toutes", value: "all" },
  { label: "Disponibles", value: "available" },
  { label: "Indisponibles", value: "unavailable" },
];

const sortOptions: Array<{ label: string; value: ZoneSort }> = [
  { label: "A-Z", value: "name" },
];

type ZoneExplorerControlsProps = {
  availability: ZoneAvailabilityFilter;
  favoritesFilter: ZoneFavoritesFilter;
  query: string;
  resultCount: number;
  sort: ZoneSort;
  onAvailabilityChange: (value: ZoneAvailabilityFilter) => void;
  onFavoritesFilterChange: (value: ZoneFavoritesFilter) => void;
  onQueryChange: (value: string) => void;
  onSortChange: (value: ZoneSort) => void;
  favoriteCount: number;
};

export function ZoneExplorerControls({
  availability,
  favoritesFilter,
  query,
  resultCount,
  sort,
  onAvailabilityChange,
  onFavoritesFilterChange,
  onQueryChange,
  onSortChange,
  favoriteCount,
}: ZoneExplorerControlsProps) {
  return (
    <div className="premium-surface sticky top-20 z-20 rounded-2xl p-3 sm:p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Rechercher une zone, description..."
            className="h-12 rounded-full bg-background pl-11"
          />
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-primary" />
          {availabilityOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={availability === option.value ? "default" : "outline"}
              onClick={() => onAvailabilityChange(option.value)}
              className="shrink-0 rounded-full"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Badge variant="outline" className="w-fit rounded-full bg-primary/5 px-3 py-1 text-primary">
          {resultCount} expérience{resultCount > 1 ? "s" : ""} trouvée{resultCount > 1 ? "s" : ""}
        </Badge>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
          <Button
            type="button"
            size="sm"
            variant={favoritesFilter === "favorites" ? "default" : "outline"}
            onClick={() => onFavoritesFilterChange(favoritesFilter === "favorites" ? "all" : "favorites")}
            className="shrink-0 rounded-full"
          >
            <Heart className={favoritesFilter === "favorites" ? "h-4 w-4 fill-current" : "h-4 w-4"} /> Favoris ({favoriteCount})
          </Button>
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={sort === option.value ? "secondary" : "ghost"}
              onClick={() => onSortChange(option.value)}
              className="shrink-0 rounded-full"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
