import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  mot_de_passe: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const registerSchema = loginSchema.extend({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
