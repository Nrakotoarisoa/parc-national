import { z } from "zod";

export const reviewSchema = z.object({
  note: z.coerce.number().min(1).max(5),
  commentaire: z.string().min(10, "Le commentaire doit contenir au moins 10 caractères").max(600),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
