import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";
import { downloadReservationReceiptPdf } from "@/lib/pdf";
import { useToast } from "@/components/ui/toast";
import { useCancelReservationMutation, useGetMyReservationsQuery } from "@/features/reservations/api/reservationsApi";
import { useAppSelector } from "@/hooks/redux";
import { formatDate } from "@/lib/utils";
import type { Reservation } from "@/types/domain";

export function MyReservationsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { toast } = useToast();
  const { data: reservations, isError, isLoading, refetch } = useGetMyReservationsQuery();
  const [cancelReservation, cancelState] = useCancelReservationMutation();

  const handleCancel = async (id: number) => {
    try {
      await cancelReservation(id).unwrap();
      toast({
        title: "Réservation annulée.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Impossible d'annuler la réservation.",
        variant: "error",
      });
    }
  };

  const downloadReceipt = (reservation: Reservation) => {
    if (!user || !reservation.activite) return;
    downloadReservationReceiptPdf({
      user,
      reservation,
      activity: reservation.activite,
    });
  };

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">Mes réservations</h1>
      <div className="mt-6 grid gap-4">
        {isLoading ? <LoadingGrid /> : null}
        {isError ? <ErrorState onRetry={refetch} /> : null}
        {reservations?.map((reservation) => (
          <Card key={reservation.id_reservation}>
            <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <div>
                <p className="font-semibold">{reservation.activite?.type ?? `Activité ${reservation.id_activite}`}</p>
                {reservation.activite ? (
                  <Badge variant="outline" className="mt-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {reservation.activite.zone?.nom ?? "Zone inconnue"}
                  </Badge>
                ) : null}
                <p className="mt-3 text-sm text-muted-foreground">
                  Du {formatDate(reservation.date_debut)} au {formatDate(reservation.date_fin)} · {reservation.statut === "paye" ? "Payée" : "Non payée"}
                  <br />
                  N°: {reservation.id_reservation}
                </p>
              </div>
              <Button
                disabled={cancelState.isLoading || reservation.statut === "annule"}
                variant="outline"
                onClick={() => handleCancel(reservation.id_reservation)}
              >
                Annuler
              </Button>
              {reservation.activite ? (
                <Button
                  variant="secondary"
                  onClick={() => downloadReceipt(reservation)}
                >
                  Télécharger le reçu
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
