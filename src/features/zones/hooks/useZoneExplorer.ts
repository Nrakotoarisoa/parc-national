import { useMemo } from "react";
import type { Zone } from "@/types/domain";
import type { ZoneAvailabilityFilter, ZoneSort } from "@/features/zones/types";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function getZoneRating(zone: Zone) {
  return zone.rating ?? 4.2 + (zone.id_zone % 7) / 10;
}

function getZoneReviewCount(zone: Zone) {
  return zone.review_count ?? 24 + zone.id_zone * 9;
}

export function useZoneExplorer(zones: Zone[] | undefined, query: string, availability: ZoneAvailabilityFilter, sort: ZoneSort) {
  return useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return (zones ?? [])
      .filter((zone) => {
        const matchesQuery = normalizedQuery
          ? normalize(`${zone.nom} ${zone.description_zone}`).includes(normalizedQuery)
          : true;
        const matchesAvailability =
          availability === "all" ||
          (availability === "available" && zone.disponibilite) ||
          (availability === "unavailable" && !zone.disponibilite);

        return matchesQuery && matchesAvailability;
      })
      .sort((first, second) => {
        if (sort === "rating") return getZoneRating(second) - getZoneRating(first);
        if (sort === "reviews") return getZoneReviewCount(second) - getZoneReviewCount(first);
        if (sort === "name") return first.nom.localeCompare(second.nom, "fr");
        return Number(second.disponibilite) - Number(first.disponibilite) || getZoneRating(second) - getZoneRating(first);
      });
  }, [availability, query, sort, zones]);
}

export function getZoneMeta(zone: Zone) {
  return {
    rating: getZoneRating(zone),
    reviewCount: getZoneReviewCount(zone),
    gallery: [
      zone.image_url,
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
    ].filter(Boolean),
  };
}
