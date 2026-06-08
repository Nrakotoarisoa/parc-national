import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  reservationSchema,
  type ReservationFormValues,
} from "@/features/reservations/schemas/reservation.schemas";

type ReservationFormProps = {
  activityId: number;
  onSubmit: (values: ReservationFormValues) => Promise<void> | void;
  isLoading?: boolean;
};

export function ReservationForm({ activityId, isLoading = false, onSubmit }: ReservationFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      id_activite: activityId,
    },
  });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id_activite")} />
      <div>
        <label className="text-sm font-medium" htmlFor="date_debut">
          Date de début
        </label>
        <Input id="date_debut" type="date" {...register("date_debut")} />
        {errors.date_debut ? <p className="mt-1 text-xs text-destructive">{errors.date_debut.message}</p> : null}
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="date_fin">
          Date de fin
        </label>
        <Input id="date_fin" type="date" {...register("date_fin")} />
        {errors.date_fin ? <p className="mt-1 text-xs text-destructive">{errors.date_fin.message}</p> : null}
      </div>
      <Button disabled={isLoading} type="submit">
        <CalendarCheck className="h-4 w-4" />
        Confirmer la réservation
      </Button>
    </form>
  );
}
