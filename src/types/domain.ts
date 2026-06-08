export type UserRole = "client" | "admin";

export type User = {
  id_utilisateur: number;
  nom: string;
  email: string;
  role: UserRole;
  date_creation: string;
};

export type Zone = {
  id_zone: number;
  nom: string;
  description_zone: string;
  disponibilite: boolean;
  image_url: string;
};

export type Activity = {
  id_activite: number;
  id_zone: number;
  type: string;
  description_act: string;
  prix: number;
  zone?: Zone;
};

export type ReservationStatus = "non_paye" | "paye" | "annule";

export type Reservation = {
  id_reservation: number;
  id_utilisateur: number;
  id_activite: number;
  date_debut: string;
  date_fin: string;
  statut: ReservationStatus;
  activite?: Activity;
};

export type Review = {
  id_avis: number;
  id_utilisateur: number;
  note: number;
  commentaire: string;
  date_publication: string;
  utilisateur?: Pick<User, "nom">;
};

export type AdminStats = {
  totalUsers: number;
  totalActivities: number;
  totalReservations: number;
  paidReservations: number;
};
