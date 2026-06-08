import { baseApi } from "@/app/store/baseApi";
import type { Activity, AdminStats, Zone } from "@/types/domain";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, void>({
      query: () => ({ url: "/api/admin/stats" }),
      providesTags: ["AdminStats"],
    }),
    createAdminZone: builder.mutation<Zone, Omit<Zone, "id_zone">>({
      query: (data) => ({ url: "/api/admin/zones", method: "POST", data }),
      invalidatesTags: ["Zone", "AdminStats"],
    }),
    createAdminActivity: builder.mutation<Activity, Omit<Activity, "id_activite" | "zone">>({
      query: (data) => ({ url: "/api/admin/activites", method: "POST", data }),
      invalidatesTags: ["Activity", "AdminStats"],
    }),
  }),
});

export const { useCreateAdminActivityMutation, useCreateAdminZoneMutation, useGetAdminStatsQuery } = adminApi;
