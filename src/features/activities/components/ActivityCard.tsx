import { Link } from "react-router-dom";
import { CalendarPlus, Star } from "lucide-react";
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
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="accent">{activity.type}</Badge>
          <span className="flex items-center gap-1 text-sm font-medium">
            <Star className="h-4 w-4 fill-accent text-accent" />
            4.8
          </span>
        </div>
        <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">{activity.description_act}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-lg font-bold">{formatPrice(activity.prix)}</span>
          <Button asChild size="sm">
            <Link to={`/activites/${activity.id_activite}`}>
              <CalendarPlus className="h-4 w-4" />
              Réserver
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
