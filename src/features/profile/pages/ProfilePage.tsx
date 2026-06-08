import { useMeQuery } from "@/features/auth/api/authApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";

export function ProfilePage() {
  const { data: user, isError, isLoading, refetch } = useMeQuery();

  if (isLoading) return <section className="container py-10"><LoadingGrid /></section>;
  if (isError || !user) return <section className="container py-10"><ErrorState onRetry={refetch} /></section>;

  return (
    <section className="container py-10">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Profil utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <p><span className="font-medium">Nom:</span> {user.nom}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Rôle:</span> {user.role}</p>
        </CardContent>
      </Card>
    </section>
  );
}
