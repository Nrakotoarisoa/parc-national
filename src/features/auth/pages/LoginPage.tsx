import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/features/auth/api/authApi";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/auth.schemas";
import { setCredentials } from "@/features/auth/slices/authSlice";
import { useAppDispatch } from "@/hooks/redux";
import { routes } from "@/lib/constants";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, loginState] = useLoginMutation();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const submit = async (values: LoginFormValues) => {
    const response = await login(values).unwrap();
    dispatch(setCredentials(response));
    navigate(routes.home);
  };

  return (
    <section className="container grid min-h-[70vh] place-items-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
            <div>
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="mot_de_passe">
                Mot de passe
              </label>
              <Input id="mot_de_passe" type="password" {...register("mot_de_passe")} />
              {errors.mot_de_passe ? (
                <p className="mt-1 text-xs text-destructive">{errors.mot_de_passe.message}</p>
              ) : null}
            </div>
            <Button disabled={loginState.isLoading} type="submit">
              <LogIn className="h-4 w-4" />
              Se connecter
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Pas encore de compte ? <Link className="font-medium text-primary" to={routes.register}>Créer un compte</Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
