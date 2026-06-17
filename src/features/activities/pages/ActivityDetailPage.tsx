import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CalendarCheck, ChevronLeft, LockKeyhole } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";
import { useToast } from "@/components/ui/toast";
import { useGetActivityQuery } from "@/features/activities/api/activitiesApi";
import { ReservationForm } from "@/features/reservations/components/ReservationForm";
import { useCreateReservationMutation } from "@/features/reservations/api/reservationsApi";
import { openAuthDialog } from "@/features/auth/slices/authDialogSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { downloadReservationReceiptPdf } from "@/lib/pdf";
import { formatDate, formatPrice } from "@/lib/utils";
import { routes } from "@/lib/constants";
import type { Reservation } from "@/types/domain";

export function ActivityDetailPage() {
  const id = Number(useParams().id);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const { data: activity, isError, isLoading, refetch } = useGetActivityQuery(id, { skip: Number.isNaN(id) });
  const [createReservation, createState] = useCreateReservationMutation();
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const { toast } = useToast();

  useEffect(() => {
    if (activity && !token) {
      dispatch(openAuthDialog({ mode: "login", redirectTo: `${location.pathname}${location.search}` }));
    }
  }, [activity, dispatch, location.pathname, location.search, token]);

  if (isLoading) return <section className="container py-10"><LoadingGrid /></section>;
  if (isError || !activity) return <section className="container py-10"><ErrorState onRetry={refetch} /></section>;

  return (
    <section className="container grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
      <div className="col-span-full">
        <Button asChild variant="ghost" className="rounded-full">
          <Link to={routes.activities}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour aux activités
          </Link>
        </Button>
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">{activity.type}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em]">Réserver cette activité</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{activity.description_act}</p>
        <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-border/80 bg-muted-foreground/5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Zone concernée</span>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Tous les zones
            </Badge>
          </div>
          {activity.zone?.description_zone ? (
            <p className="text-sm leading-6 text-muted-foreground">{activity.zone.description_zone}</p>
          ) : null}
        </div>
        <p className="mt-6 text-2xl font-extrabold">{formatPrice(activity.prix)}</p>
      </div>
      <Card className="rounded-3xl premium-surface">
        <CardHeader>
          <CardTitle>{token ? "Dates de visite" : "Connexion requise"}</CardTitle>
        </CardHeader>
        <CardContent>
          {token ? (
            <>
              <ReservationForm
                activityId={activity.id_activite}
                isLoading={createState.isLoading}
                onSubmit={async (values) => {
                  try {
                    const reservation = await createReservation(values).unwrap();
                    setCreatedReservation(reservation);
                    toast({
                      title: `Réservation confirmée pour ${activity.type}.`,
                      description: `Du ${formatDate(reservation.date_debut)} au ${formatDate(reservation.date_fin)}.`,
                      variant: "success",
                      actionLabel: "Télécharger le reçu PDF",
                      action: () => {
                        if (!user) return;
                        downloadReservationReceiptPdf({
                          user,
                          reservation,
                          activity,
                        });
                      },
                    });
                  } catch {
                    toast({
                      title: "Impossible de finaliser la réservation.",
                      description: "Veuillez réessayer.",
                      variant: "error",
                    });
                  }
                }}
              />
              {createdReservation && user ? (
                <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-primary">Réservation prête.</p>
                  <p className="text-sm text-muted-foreground">Vous pouvez télécharger votre reçu PDF dès maintenant.</p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      downloadReservationReceiptPdf({
                        user,
                        reservation: createdReservation,
                        activity,
                      })
                    }
                  >
                    Télécharger le reçu PDF
                  </Button>
                </div>
              ) : null}
            </>
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
