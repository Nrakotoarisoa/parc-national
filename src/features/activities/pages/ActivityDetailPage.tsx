import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";
import { useGetActivityQuery } from "@/features/activities/api/activitiesApi";
import { ReservationForm } from "@/features/reservations/components/ReservationForm";
import { useCreateReservationMutation } from "@/features/reservations/api/reservationsApi";
import { formatPrice } from "@/lib/utils";

export function ActivityDetailPage() {
  const id = Number(useParams().id);
  const { data: activity, isError, isLoading, refetch } = useGetActivityQuery(id, { skip: Number.isNaN(id) });
  const [createReservation, createState] = useCreateReservationMutation();

  if (isLoading) return <section className="container py-10"><LoadingGrid /></section>;
  if (isError || !activity) return <section className="container py-10"><ErrorState onRetry={refetch} /></section>;

  return (
    <section className="container grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">{activity.type}</p>
        <h1 className="mt-3 text-4xl font-bold">Réserver cette activité</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{activity.description_act}</p>
        <p className="mt-6 text-2xl font-bold">{formatPrice(activity.prix)}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dates de visite</CardTitle>
        </CardHeader>
        <CardContent>
          <ReservationForm
            activityId={activity.id_activite}
            isLoading={createState.isLoading}
            onSubmit={async (values) => {
              await createReservation(values).unwrap();
            }}
          />
        </CardContent>
      </Card>
    </section>
  );
}
