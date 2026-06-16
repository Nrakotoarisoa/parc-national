import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { CalendarCheck, LockKeyhole } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";
import { useGetActivityQuery } from "@/features/activities/api/activitiesApi";
import { ReservationForm } from "@/features/reservations/components/ReservationForm";
import { useCreateReservationMutation } from "@/features/reservations/api/reservationsApi";
import { openAuthDialog } from "@/features/auth/slices/authDialogSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { formatPrice } from "@/lib/utils";

export function ActivityDetailPage() {
  const id = Number(useParams().id);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const { data: activity, isError, isLoading, refetch } = useGetActivityQuery(id, { skip: Number.isNaN(id) });
  const [createReservation, createState] = useCreateReservationMutation();

  useEffect(() => {
    if (activity && !token) {
      dispatch(openAuthDialog({ mode: "login", redirectTo: `${location.pathname}${location.search}` }));
    }
  }, [activity, dispatch, location.pathname, location.search, token]);

  if (isLoading) return <section className="container py-10"><LoadingGrid /></section>;
  if (isError || !activity) return <section className="container py-10"><ErrorState onRetry={refetch} /></section>;

  return (
    <section className="container grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">{activity.type}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em]">Réserver cette activité</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{activity.description_act}</p>
        <p className="mt-6 text-2xl font-extrabold">{formatPrice(activity.prix)}</p>
      </div>
      <Card className="rounded-3xl premium-surface">
        <CardHeader>
          <CardTitle>{token ? "Dates de visite" : "Connexion requise"}</CardTitle>
        </CardHeader>
        <CardContent>
          {token ? (
            <ReservationForm
              activityId={activity.id_activite}
              isLoading={createState.isLoading}
              onSubmit={async (values) => {
                await createReservation(values).unwrap();
              }}
            />
          ) : (
            <div className="grid gap-4 text-sm leading-6 text-muted-foreground">
              <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
                <p className="mt-2 font-bold">Connectez-vous pour finaliser votre réservation.</p>
              </div>
              <p>Votre page actuelle est conservée ; le formulaire sera disponible après authentification.</p>
              <Button onClick={() => dispatch(openAuthDialog({ mode: "login", redirectTo: `${location.pathname}${location.search}` }))}>
                <CalendarCheck className="h-4 w-4" /> Continuer vers la réservation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
