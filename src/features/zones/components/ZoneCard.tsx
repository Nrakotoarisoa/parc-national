import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Zone } from "@/types/domain";

const fallbackZoneImage =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80";

type ZoneCardProps = {
  zone: Zone;
};

export function ZoneCard({ zone }: ZoneCardProps) {
  return (
    <Link to={`/zones/${zone.id_zone}`} className="group block">
      <Card className="h-full overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft">
        <img
          src={zone.image_url || fallbackZoneImage}
          alt={zone.nom}
          className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold">{zone.nom}</h3>
            <Badge variant={zone.disponibilite ? "default" : "outline"}>
              {zone.disponibilite ? "Disponible" : "Indisponible"}
            </Badge>
          </div>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{zone.description_zone}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
