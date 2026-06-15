import { Heart, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rating } from "@/components/common/Rating";
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

  return (
    <motion.article layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="group h-full overflow-hidden rounded-3xl premium-surface interactive-lift">
        <div className="relative overflow-hidden">
          <Link to={`/zones/${zone.id_zone}`} aria-label={`Découvrir ${zone.nom}`}>
            <img
              src={heroImage}
              alt={zone.nom}
              className="aspect-[4/3] w-full object-cover transition duration-700 ease-spring group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-earth-night/80 to-transparent" />
          </Link>
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge className="rounded-full bg-background/90 text-foreground backdrop-blur">
              <MapPin className="mr-1 h-3 w-3" /> Zone du parc
            </Badge>
            <Badge variant={zone.disponibilite ? "default" : "outline"} className="rounded-full backdrop-blur">
              {zone.disponibilite ? "Disponible" : "Indisponible"}
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
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 text-white">
            <Rating value={meta.rating} size="sm" className="rounded-full bg-earth-night/60 px-2 py-1 backdrop-blur" />
            <span className="inline-flex items-center gap-1 rounded-full bg-earth-night/60 px-2 py-1 text-xs font-semibold backdrop-blur">
              <MessageCircle className="h-3.5 w-3.5" /> {meta.reviewCount} avis
            </span>
          </div>
        </div>
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div>
            <Link to={`/zones/${zone.id_zone}`} className="text-lg font-bold hover:text-primary">
              {zone.nom}
            </Link>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{zone.description_zone}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {meta.gallery.slice(0, 3).map((image, index) => (
              <img
                key={`${zone.id_zone}-${image}`}
                src={image}
                alt={`${zone.nom} aperçu ${index + 1}`}
                className="aspect-square rounded-2xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
          <Button asChild variant="premium" className="w-full rounded-2xl">
            <Link to={`/zones/${zone.id_zone}`}>Explorer les avis et activités</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.article>
  );
}
