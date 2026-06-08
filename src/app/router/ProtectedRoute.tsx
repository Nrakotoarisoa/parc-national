import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMeQuery } from "@/features/auth/api/authApi";
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

  if (!token) {
    return <Navigate replace to={routes.login} state={{ from: location }} />;
  }

  if (allowedRoles && !activeUser && isLoading) {
    return <div className="container py-10 text-sm text-muted-foreground">Chargement du profil...</div>;
  }

  if (allowedRoles && (!activeUser || !allowedRoles.includes(activeUser.role))) {
    return <Navigate replace to={routes.home} />;
  }

  return <Outlet />;
}
