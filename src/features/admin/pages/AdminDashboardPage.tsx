import { motion } from "framer-motion";
import { BarChart3, CalendarCheck, Route, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useGetAdminStatsQuery } from "@/features/admin/api/adminApi";
import { cn } from "@/lib/utils";

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 rounded-3xl" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { data: stats, isError, isLoading, refetch } = useGetAdminStatsQuery();

  const cards = [
    { label: "Utilisateurs", value: stats?.totalUsers ?? 0, icon: Users, tone: "from-primary/15" },
    { label: "Activités", value: stats?.totalActivities ?? 0, icon: Route, tone: "from-earth-sun/20" },
    { label: "Réservations", value: stats?.totalReservations ?? 0, icon: CalendarCheck, tone: "from-earth-river/20" },
    { label: "Payées", value: stats?.paidReservations ?? 0, icon: BarChart3, tone: "from-emerald-500/20" },
  ];

  if (isLoading) return <AdminDashboardSkeleton />;
  if (isError || !stats) return <ErrorState onRetry={refetch} />;

  return (
    <section className="space-y-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border bg-gradient-canopy p-6 text-white shadow-glow lg:p-8"
      >
        <div className="max-w-3xl space-y-4">
          <Badge className="w-fit border-white/20 bg-white/15 text-white backdrop-blur">
            <ShieldCheck className="mr-1 h-3 w-3" /> Données API réelles
          </Badge>
          <div>
            <h1 className="text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">Pilotage du parc</h1>
            <p className="mt-3 text-sm text-white/78 md:text-base">
              Tableau de bord limité aux statistiques exposées par l'endpoint officiel disponible.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, tone }, index) => (
          <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
            <Card className={cn("overflow-hidden border-0 bg-gradient-to-br to-card shadow-soft", tone)}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardDescription>{label}</CardDescription>
                  <CardTitle className="mt-2 text-3xl">{value.toLocaleString("fr-FR")}</CardTitle>
                </div>
                <span className="rounded-2xl bg-background/80 p-3 shadow-lift">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Valeur fournie par l'API admin.</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="rounded-3xl premium-surface">
        <CardHeader>
          <CardTitle>Fonctionnalités administrateur</CardTitle>
          <CardDescription>
            Les listes détaillées, exports, analytics mensuels et actions de planification ne sont pas affichés car aucun endpoint officiel correspondant n'est disponible dans le projet.
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}
