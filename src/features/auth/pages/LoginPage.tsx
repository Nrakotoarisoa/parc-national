import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { openAuthDialog } from "@/features/auth/slices/authDialogSlice";
import { useAppDispatch } from "@/hooks/redux";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(openAuthDialog({ mode: "login", redirectTo: `${location.pathname}${location.search}` }));
  }, [dispatch, location.pathname, location.search]);

  return (
    <section className="container grid min-h-[70vh] place-items-center py-10">
      <div className="premium-surface max-w-md rounded-3xl p-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-[-0.03em]">Connexion</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Utilisez la fenêtre de connexion pour poursuivre votre parcours visiteur.
        </p>
      </div>
    </section>
  );
}
