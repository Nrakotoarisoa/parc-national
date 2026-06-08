import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/features/auth/api/authApi";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/auth.schemas";
import { setCredentials } from "@/features/auth/slices/authSlice";
import { useAppDispatch } from "@/hooks/redux";
import { routes } from "@/lib/constants";

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [registerUser, registerState] = useRegisterMutation();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const submit = async (values: RegisterFormValues) => {
    const response = await registerUser(values).unwrap();
    dispatch(setCredentials(response));
    navigate(routes.home);
  };

  return (
    <section className="container grid min-h-[70vh] place-items-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
            <div>
              <label className="text-sm font-medium" htmlFor="nom">
                Nom
              </label>
              <Input id="nom" {...register("nom")} />
              {errors.nom ? <p className="mt-1 text-xs text-destructive">{errors.nom.message}</p> : null}
            </div>
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
            <Button disabled={registerState.isLoading} type="submit">
              <UserPlus className="h-4 w-4" />
              S'inscrire
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
