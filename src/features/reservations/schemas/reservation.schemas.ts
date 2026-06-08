import { z } from "zod";

export const reservationSchema = z
  .object({
    id_activite: z.coerce.number().positive(),
    date_debut: z.string().min(1, "Date de début obligatoire"),
    date_fin: z.string().min(1, "Date de fin obligatoire"),
  })
  .refine((values) => new Date(values.date_debut) < new Date(values.date_fin), {
    path: ["date_fin"],
    message: "La date de fin doit être après la date de début",
  });

export type ReservationFormValues = z.infer<typeof reservationSchema>;
