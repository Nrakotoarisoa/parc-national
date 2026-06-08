import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ActivityDetailPage } from "@/features/activities/pages/ActivityDetailPage";
import { ActivitiesPage } from "@/features/activities/pages/ActivitiesPage";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { MyReservationsPage } from "@/features/reservations/pages/MyReservationsPage";
import { ReviewsPage } from "@/features/reviews/pages/ReviewsPage";
import { ZoneDetailPage } from "@/features/zones/pages/ZoneDetailPage";
import { ZonesPage } from "@/features/zones/pages/ZonesPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProtectedRoute } from "@/app/router/ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="zones" element={<ZonesPage />} />
        <Route path="zones/:id" element={<ZoneDetailPage />} />
        <Route path="activites" element={<ActivitiesPage />} />
        <Route path="activites/:id" element={<ActivityDetailPage />} />
        <Route path="avis" element={<ReviewsPage />} />
        <Route path="connexion" element={<LoginPage />} />
        <Route path="inscription" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="profil" element={<ProfilePage />} />
          <Route path="mes-reservations" element={<MyReservationsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
