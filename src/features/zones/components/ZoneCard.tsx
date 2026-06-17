import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Zone } from "@/types/domain";
import { getZoneMeta } from "@/features/zones/hooks/useZoneExplorer";

const fallbackZoneImage =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80";

type ZoneCardProps = {
  zone: Zone;
  isFavorite?: boolean;
  onToggleFavorite?: (zoneId: number) => void;
};

export function ZoneCard({ isFavorite = false, onToggleFavorite, zone }: ZoneCardProps) {
  const meta = getZoneMeta(zone);
  const heroImage = meta.gallery[0] || fallbackZoneImage;
  console.log(meta.gallery);

  return (
    <motion.article layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="group h-full overflow-hidden rounded-2xl premium-surface interactive-lift">
        <div className="relative overflow-hidden">
          <Link to={`/zones/${zone.id_zone}`} aria-label={`Découvrir ${zone.nom}`}>
            <img
              src={heroImage}
              alt={zone.nom}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-earth-night/80 to-transparent" />
          </Link>
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">

            <Badge variant={zone.disponibilite === "dispo" ? "default" : "outline"} className="rounded-full backdrop-blur">
              {zone.disponibilite === "dispo" ? "Disponible" : "Indisponible"}
            </Badge>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={(event) => {
              event.preventDefault();
              onToggleFavorite?.(zone.id_zone);
            }}
            className="absolute right-3 top-3 rounded-full bg-background/85 backdrop-blur hover:bg-background"
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className={cn("h-5 w-5", isFavorite && "fill-accent text-accent")} />
          </Button>
        </div>
        <CardContent className="space-y-3 p-4">
          <div>
            <Link to={`/zones/${zone.id_zone}`} className="text-base font-extrabold tracking-[-0.01em] hover:text-primary">
              {zone.nom}
            </Link>
            <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted-foreground">{zone.description_zone}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {meta.gallery.slice(0, 3).map((image, index) => (
              <img
                key={`${zone.id_zone}-${image}`}
                src={image}
                alt={`${zone.nom} aperçu ${index + 1}`}
                className="aspect-[4/3] rounded-xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
          <Button asChild variant="premium" className="w-full">
            <Link to={`/zones/${zone.id_zone}`}>Voir les détails</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.article>
  );
}
