import { Link, useParams } from "react-router-dom";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetZoneQuery } from "@/features/zones/api/zonesApi";

export function ZoneDetailPage() {
  const id = Number(useParams().id);
  const { data: zone, isError, isLoading, refetch } = useGetZoneQuery(id, { skip: Number.isNaN(id) });

  if (isLoading) return <section className="container py-10"><LoadingGrid /></section>;
  if (isError || !zone) return <section className="container py-10"><ErrorState onRetry={refetch} /></section>;

  return (
    <section className="container py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <img src={zone.image_url} alt={zone.nom} className="aspect-[16/10] rounded-lg object-cover shadow-soft" />
        <div className="self-center">
          <Badge>{zone.disponibilite ? "Disponible" : "Indisponible"}</Badge>
          <h1 className="mt-4 text-4xl font-bold">{zone.nom}</h1>
          <p className="mt-4 leading-7 text-muted-foreground">{zone.description_zone}</p>
          <Button asChild className="mt-6">
            <Link to={`/activites?zone=${zone.id_zone}`}>Voir les activités</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
