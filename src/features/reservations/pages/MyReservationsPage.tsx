import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";
import { useCancelReservationMutation, useGetMyReservationsQuery } from "@/features/reservations/api/reservationsApi";
import { formatDate } from "@/lib/utils";

export function MyReservationsPage() {
  const { data: reservations, isError, isLoading, refetch } = useGetMyReservationsQuery();
  const [cancelReservation, cancelState] = useCancelReservationMutation();

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">Mes réservations</h1>
      <div className="mt-6 grid gap-4">
        {isLoading ? <LoadingGrid /> : null}
        {isError ? <ErrorState onRetry={refetch} /> : null}
        {reservations?.map((reservation) => (
          <Card key={reservation.id_reservation}>
            <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="font-semibold">{reservation.activite?.type ?? `Activité ${reservation.id_activite}`}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Du {formatDate(reservation.date_debut)} au {formatDate(reservation.date_fin)} · {reservation.statut}
                </p>
              </div>
              <Button
                disabled={cancelState.isLoading || reservation.statut === "annule"}
                variant="outline"
                onClick={() => cancelReservation(reservation.id_reservation)}
              >
                Annuler
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
