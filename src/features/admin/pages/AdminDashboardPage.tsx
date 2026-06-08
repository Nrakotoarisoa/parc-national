import { BarChart3, CalendarCheck, Route, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";
import { useGetAdminStatsQuery } from "@/features/admin/api/adminApi";

export function AdminDashboardPage() {
  const { data: stats, isError, isLoading, refetch } = useGetAdminStatsQuery();

  if (isLoading) return <LoadingGrid />;
  if (isError || !stats) return <ErrorState onRetry={refetch} />;

  const cards = [
    { label: "Utilisateurs", value: stats.totalUsers, icon: Users },
    { label: "Activités", value: stats.totalActivities, icon: Route },
    { label: "Réservations", value: stats.totalReservations, icon: CalendarCheck },
    { label: "Réservations payées", value: stats.paidReservations, icon: BarChart3 },
  ];

  return (
    <section>
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
