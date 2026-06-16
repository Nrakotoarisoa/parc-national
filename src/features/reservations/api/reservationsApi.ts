import { baseApi } from "@/app/store/baseApi";
import type { Reservation } from "@/types/domain";
import type { ReservationFormValues } from "@/features/reservations/schemas/reservation.schemas";

export const reservationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReservation: builder.mutation<Reservation, ReservationFormValues>({
      query: (data) => ({ url: "/api/reservations", method: "POST", data }),
      invalidatesTags: ["Reservation"],
    }),
    getMyReservations: builder.query<Reservation[], void>({
      query: () => ({ url: "/api/reservations/mes-reservations" }),
      providesTags: ["Reservation"],
    }),
    cancelReservation: builder.mutation<Reservation, number>({
      query: (id) => ({ url: `/api/reservations/${id}`, method: "PUT" }),
      invalidatesTags: ["Reservation"],
    }),
  }),
});

export const { useCancelReservationMutation, useCreateReservationMutation, useGetMyReservationsQuery } =
  reservationsApi;
