import { CalendarCheck, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useMeQuery } from "@/features/auth/api/authApi";
import { useGetMyReservationsQuery } from "@/features/reservations/api/reservationsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";
import { formatDate } from "@/lib/utils";

export function ProfilePage() {
  const { data: user, isError, isLoading, refetch } = useMeQuery();
  const { data: reservations, isError: reservationsError, isLoading: reservationsLoading } = useGetMyReservationsQuery();

  if (isLoading) return <section className="container py-10"><LoadingGrid /></section>;
  if (isError || !user) return <section className="container py-10"><ErrorState onRetry={refetch} /></section>;

  return (
    <section className="bg-gradient-mist">
      <div className="container grid gap-6 py-10 lg:grid-cols-[360px_1fr]">
        <Card className="rounded-3xl premium-surface h-fit overflow-hidden">
          <div className="h-28 bg-gradient-canopy" />
          <CardContent className="-mt-12 p-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-card bg-primary text-3xl font-extrabold text-primary-foreground">
              {user.nom.slice(0, 1).toUpperCase()}
            </div>
            <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.03em]">{user.nom}</h1>
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {user.email}</p>
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Rôle : {user.role}</p>
              <p className="flex items-center gap-2"><UserRound className="h-4 w-4 text-primary" /> Membre depuis {formatDate(user.date_creation)}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="rounded-3xl premium-surface">
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-2xl bg-muted/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Identifiant</p>
                <p className="mt-1 font-bold">#{user.id_utilisateur}</p>
              </div>
              <div className="rounded-2xl bg-muted/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Statut</p>
                <p className="mt-1 font-bold text-primary">Compte actif</p>
              </div>
              <div className="rounded-2xl bg-muted/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Réservations</p>
                <p className="mt-1 font-bold">{reservations?.length ?? 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl premium-surface">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-primary" /> Historique des réservations</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {reservationsLoading ? <LoadingGrid /> : null}
              {reservationsError ? <p className="text-sm text-destructive">Impossible de charger les réservations.</p> : null}
              {!reservationsLoading && !reservationsError && reservations?.length === 0 ? (
                <p className="rounded-2xl bg-muted/70 p-4 text-sm text-muted-foreground">Aucune réservation pour le moment.</p>
              ) : null}
              {reservations?.map((reservation) => (
                <div key={reservation.id_reservation} className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold">{reservation.activite?.type ?? `Activité ${reservation.id_activite}`}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Du {formatDate(reservation.date_debut)} au {formatDate(reservation.date_fin)}
                    </p>
                  </div>
                  <Badge variant={reservation.statut === "annule" ? "outline" : "trust"}>{reservation.statut}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
