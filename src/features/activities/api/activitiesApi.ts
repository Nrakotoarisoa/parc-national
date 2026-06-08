import { baseApi } from "@/app/store/baseApi";
import type { Activity } from "@/types/domain";

export const activitiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<Activity[], { zoneId?: number } | void>({
      query: (params) => ({ url: "/api/activites", params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id_activite }) => ({ type: "Activity" as const, id: id_activite })),
              { type: "Activity", id: "LIST" },
            ]
          : [{ type: "Activity", id: "LIST" }],
    }),
    getActivity: builder.query<Activity, number>({
      query: (id) => ({ url: `/api/activites/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Activity", id }],
    }),
  }),
});

export const { useGetActivitiesQuery, useGetActivityQuery } = activitiesApi;
