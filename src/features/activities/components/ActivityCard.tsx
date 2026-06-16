import { Link } from "react-router-dom";
import { CalendarPlus, Clock3, Leaf, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Activity } from "@/types/domain";

type ActivityCardProps = {
  activity: Activity;
};

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-border/80 bg-card/95 transition duration-200 hover:border-primary/35 hover:bg-card">
      <CardContent className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="accent" className="rounded-full px-3 py-1">
              <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
              {activity.type}
            </Badge>
            <h2 className="line-clamp-2 text-base font-extrabold tracking-[-0.01em]">Expérience {activity.type.toLowerCase()}</h2>
          </div>
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            Disponible
          </span>
        </div>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">{activity.description_act}</p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted/70 px-3 py-2">
            <Clock3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Demi-journée
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted/70 px-3 py-2">
            <UsersRound className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Petit groupe
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Dès</span>
            <span className="text-xl font-extrabold">{formatPrice(activity.prix)}</span>
          </div>
          <Button asChild size="sm" className="rounded-full">
            <Link to={`/activites/${activity.id_activite}`}>
              <CalendarPlus className="h-4 w-4" aria-hidden="true" />
              Réserver
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
