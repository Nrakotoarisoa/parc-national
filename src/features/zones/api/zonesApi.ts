import { baseApi } from "@/app/store/baseApi";
import type { Zone } from "@/types/domain";

export const zonesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getZones: builder.query<Zone[], void>({
      query: () => ({ url: "/api/zones" }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id_zone }) => ({ type: "Zone" as const, id: id_zone })), { type: "Zone", id: "LIST" }]
          : [{ type: "Zone", id: "LIST" }],
    }),
    getZone: builder.query<Zone, number>({
      query: (id) => ({ url: `/api/zones/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Zone", id }],
    }),
  }),
});

export const { useGetZoneQuery, useGetZonesQuery } = zonesApi;
