import { baseApi } from "@/app/store/baseApi";
import type { Activity, Reservation, Zone } from "@/types/domain";

export type AdminZonePayload = Omit<Zone, "id_zone" | "rating" | "review_count" | "tags" | "image_url"> & {
  image?: File | null;
  image_url?: string;
};
export type AdminActivityPayload = Omit<Activity, "id_activite" | "zone">;
export type AdminReservationPayload = Partial<Pick<Reservation, "date_debut" | "date_fin" | "statut">>;

function zoneToFormData(data: Partial<AdminZonePayload>) {
  const formData = new FormData();

  if (data.nom !== undefined) formData.append("nom", data.nom);
  if (data.description_zone !== undefined) formData.append("description_zone", data.description_zone);
  if (data.disponibilite !== undefined) formData.append("disponibilite", String(data.disponibilite));
  if (data.image instanceof File) formData.append("image", data.image);
  if (!data.image && data.image_url) formData.append("image_url", data.image_url);

  return formData;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdminZone: builder.mutation<Zone, AdminZonePayload>({
      query: (data) => ({ url: "/api/zones/", method: "POST", data: zoneToFormData(data) }),
      invalidatesTags: ["Zone"],
    }),
    updateAdminZone: builder.mutation<Zone, { id: number; data: Partial<AdminZonePayload> }>({
      query: ({ id, data }) => ({ url: `/api/zones/${id}`, method: "PUT", data: zoneToFormData(data) }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Zone", id }, { type: "Zone", id: "LIST" }],
    }),
    deleteAdminZone: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/zones/${id}`, method: "DELETE" }),
      invalidatesTags: ["Zone"],
    }),
    createAdminActivity: builder.mutation<Activity, AdminActivityPayload>({
      query: (data) => ({ url: "/api/activites/", method: "POST", data }),
      invalidatesTags: ["Activity"],
    }),
    updateAdminActivity: builder.mutation<Activity, { id: number; data: Partial<AdminActivityPayload> }>({
      query: ({ id, data }) => ({ url: `/api/activites/${id}`, method: "PUT", data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Activity", id }, { type: "Activity", id: "LIST" }],
    }),
    deleteAdminActivity: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/activites/${id}`, method: "DELETE" }),
      invalidatesTags: ["Activity"],
    }),
    getAdminReservations: builder.query<Reservation[], void>({
      query: () => ({ url: "/api/reservations/" }),
      providesTags: ["Reservation"],
    }),
    updateAdminReservation: builder.mutation<Reservation, { id: number; data: AdminReservationPayload }>({
      query: ({ id, data }) => ({ url: `/api/reservations/${id}`, method: "PUT", data }),
      invalidatesTags: ["Reservation"],
    }),
    deleteAdminReview: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/avis/${id}`, method: "DELETE" }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useCreateAdminActivityMutation,
  useCreateAdminZoneMutation,
  useDeleteAdminActivityMutation,
  useDeleteAdminReviewMutation,
  useDeleteAdminZoneMutation,
  useGetAdminReservationsQuery,
  useUpdateAdminActivityMutation,
  useUpdateAdminReservationMutation,
  useUpdateAdminZoneMutation,
} = adminApi;
