import type { User } from "@/types/domain";

export type LoginRequest = {
  email: string;
  mot_de_passe: string;
};

export type RegisterRequest = LoginRequest & {
  nom: string;
};

export type AuthResponse = {
  access_token: string;
  utilisateur: User;
};
