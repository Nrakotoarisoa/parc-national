import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { useMeQuery } from "@/features/auth/api/authApi";
import { openAuthDialog } from "@/features/auth/slices/authDialogSlice";
import { setUser } from "@/features/auth/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { routes } from "@/lib/constants";
import type { UserRole } from "@/types/domain";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
};

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  const { data: profile, isLoading } = useMeQuery(undefined, { skip: !token || Boolean(user) });
  const activeUser = user ?? profile;

  useEffect(() => {
    if (profile) {
      dispatch(setUser(profile));
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (!token) {
      dispatch(openAuthDialog({ mode: "login", redirectTo: `${location.pathname}${location.search}` }));
    }
  }, [dispatch, location.pathname, location.search, token]);

  if (!token) {
    return (
      <section className="container grid min-h-[60vh] place-items-center py-10">
        <div className="premium-surface max-w-md rounded-3xl p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LockKeyhole className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.03em]">Connexion requise</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Connectez-vous pour accéder à cette page. La fenêtre d'authentification est ouverte automatiquement.
          </p>
        </div>
      </section>
    );
  }

  if (allowedRoles && !activeUser && isLoading) {
    return <div className="container py-10 text-sm text-muted-foreground">Chargement du profil...</div>;
  }

  if (allowedRoles && (!activeUser || !allowedRoles.includes(activeUser.role))) {
    return <Navigate replace to={routes.home} />;
  }

  return <Outlet />;
}
