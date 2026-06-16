import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/lib/constants";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLoginMutation, useRegisterMutation } from "@/features/auth/api/authApi";
import { closeAuthDialog, setAuthDialogMode } from "@/features/auth/slices/authDialogSlice";
import { setCredentials } from "@/features/auth/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const loginDialogSchema = z.object({
  email: z.string().email("Email invalide"),
  mot_de_passe: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const registerDialogSchema = loginDialogSchema
  .extend({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    confirmation: z.string().min(6, "La confirmation est obligatoire"),
  })
  .refine((values) => values.mot_de_passe === values.confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmation"],
  });

type LoginDialogValues = z.infer<typeof loginDialogSchema>;
type RegisterDialogValues = z.infer<typeof registerDialogSchema>;

export function AuthDialog() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, mode, redirectTo } = useAppSelector((state) => state.authDialog);
  const [login, loginState] = useLoginMutation();
  const [registerUser, registerState] = useRegisterMutation();
  const loginForm = useForm<LoginDialogValues>({ resolver: zodResolver(loginDialogSchema) });
  const registerForm = useForm<RegisterDialogValues>({ resolver: zodResolver(registerDialogSchema) });
  const isLogin = mode === "login";

  const finishAuthentication = (response: Parameters<typeof setCredentials>[0]) => {
    dispatch(setCredentials(response));
    dispatch(closeAuthDialog());

    const destination = redirectTo ?? location.pathname;
    const isAuthRoute = destination === routes.login || destination === routes.register;
    const nextDestination = isAuthRoute ? routes.home : destination;

    if (nextDestination && nextDestination !== location.pathname) {
      navigate(nextDestination, { replace: true });
    }
  };

  const submitLogin = async (values: LoginDialogValues) => {
    const response = await login(values).unwrap();
    finishAuthentication(response);
  };

  const submitRegister = async ({ confirmation: _confirmation, prenom, nom, ...values }: RegisterDialogValues) => {
    const response = await registerUser({ ...values, nom: `${prenom} ${nom}`.trim() }).unwrap();
    finishAuthentication(response);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && dispatch(closeAuthDialog())}>
      <DialogContent className="animate-fade-up">
        <DialogClose onClick={() => dispatch(closeAuthDialog())} />
        <div className="pr-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Compte voyageur sécurisé
          </p>
          <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.03em]">
            {isLogin ? "Connectez-vous pour continuer" : "Créez votre compte visiteur"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {isLogin
              ? "Retrouvez vos réservations, avis et préférences sans quitter votre parcours."
              : "Inscrivez-vous pour réserver vos expériences et suivre votre historique."}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-full bg-muted p-1">
          <button
            type="button"
            className={isLogin ? "rounded-full bg-card px-4 py-2 text-sm font-bold text-foreground" : "px-4 py-2 text-sm font-bold text-muted-foreground"}
            onClick={() => dispatch(setAuthDialogMode("login"))}
          >
            Connexion
          </button>
          <button
            type="button"
            className={!isLogin ? "rounded-full bg-card px-4 py-2 text-sm font-bold text-foreground" : "px-4 py-2 text-sm font-bold text-muted-foreground"}
            onClick={() => dispatch(setAuthDialogMode("register"))}
          >
            Inscription
          </button>
        </div>

        {isLogin ? (
          <form className="mt-5 grid gap-4" onSubmit={loginForm.handleSubmit(submitLogin)}>
            <div>
              <label className="text-sm font-bold" htmlFor="auth-email">Email</label>
              <Input id="auth-email" type="email" autoComplete="email" {...loginForm.register("email")} />
              {loginForm.formState.errors.email ? <p className="mt-1 text-xs text-destructive">{loginForm.formState.errors.email.message}</p> : null}
            </div>
            <div>
              <label className="text-sm font-bold" htmlFor="auth-password">Mot de passe</label>
              <Input id="auth-password" type="password" autoComplete="current-password" {...loginForm.register("mot_de_passe")} />
              {loginForm.formState.errors.mot_de_passe ? <p className="mt-1 text-xs text-destructive">{loginForm.formState.errors.mot_de_passe.message}</p> : null}
            </div>
            <Button disabled={loginState.isLoading} type="submit">
              <LogIn className="h-4 w-4" /> Connexion
            </Button>
          </form>
        ) : (
          <form className="mt-5 grid gap-4" onSubmit={registerForm.handleSubmit(submitRegister)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-bold" htmlFor="register-prenom">Prénom</label>
                <Input id="register-prenom" autoComplete="given-name" {...registerForm.register("prenom")} />
                {registerForm.formState.errors.prenom ? <p className="mt-1 text-xs text-destructive">{registerForm.formState.errors.prenom.message}</p> : null}
              </div>
              <div>
                <label className="text-sm font-bold" htmlFor="register-nom">Nom</label>
                <Input id="register-nom" autoComplete="family-name" {...registerForm.register("nom")} />
                {registerForm.formState.errors.nom ? <p className="mt-1 text-xs text-destructive">{registerForm.formState.errors.nom.message}</p> : null}
              </div>
            </div>
            <div>
              <label className="text-sm font-bold" htmlFor="register-email">Email</label>
              <Input id="register-email" type="email" autoComplete="email" {...registerForm.register("email")} />
              {registerForm.formState.errors.email ? <p className="mt-1 text-xs text-destructive">{registerForm.formState.errors.email.message}</p> : null}
            </div>
            <div>
              <label className="text-sm font-bold" htmlFor="register-password">Mot de passe</label>
              <Input id="register-password" type="password" autoComplete="new-password" {...registerForm.register("mot_de_passe")} />
              {registerForm.formState.errors.mot_de_passe ? <p className="mt-1 text-xs text-destructive">{registerForm.formState.errors.mot_de_passe.message}</p> : null}
            </div>
            <div>
              <label className="text-sm font-bold" htmlFor="register-confirmation">Confirmation</label>
              <Input id="register-confirmation" type="password" autoComplete="new-password" {...registerForm.register("confirmation")} />
              {registerForm.formState.errors.confirmation ? <p className="mt-1 text-xs text-destructive">{registerForm.formState.errors.confirmation.message}</p> : null}
            </div>
            <Button disabled={registerState.isLoading} type="submit">
              <UserPlus className="h-4 w-4" /> Créer mon compte
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
