import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ZoneAvailabilityFilter, ZoneSort } from "@/features/zones/types";

const availabilityOptions: Array<{ label: string; value: ZoneAvailabilityFilter }> = [
  { label: "Toutes", value: "all" },
  { label: "Disponibles", value: "available" },
  { label: "Indisponibles", value: "unavailable" },
];

const sortOptions: Array<{ label: string; value: ZoneSort }> = [
  { label: "Recommandées", value: "recommended" },
  { label: "Mieux notées", value: "rating" },
  { label: "Plus d'avis", value: "reviews" },
  { label: "A-Z", value: "name" },
];

type ZoneExplorerControlsProps = {
  availability: ZoneAvailabilityFilter;
  query: string;
  resultCount: number;
  sort: ZoneSort;
  onAvailabilityChange: (value: ZoneAvailabilityFilter) => void;
  onQueryChange: (value: string) => void;
  onSortChange: (value: ZoneSort) => void;
};

export function ZoneExplorerControls({
  availability,
  query,
  resultCount,
  sort,
  onAvailabilityChange,
  onQueryChange,
  onSortChange,
}: ZoneExplorerControlsProps) {
  return (
    <div className="premium-surface sticky top-20 z-20 rounded-3xl p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Rechercher une forêt, une cascade, une zone..."
            className="h-12 rounded-2xl pl-11"
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
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
          {resultCount} expérience{resultCount > 1 ? "s" : ""} trouvée{resultCount > 1 ? "s" : ""}
        </Badge>
        <div className="flex gap-2 overflow-x-auto pb-1">
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
