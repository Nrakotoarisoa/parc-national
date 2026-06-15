import { baseApi } from "@/app/store/baseApi";
import type { Zone } from "@/types/domain";
import type { ZoneAvailabilityFilter, ZoneSort } from "@/features/zones/types";

export type GetZonesParams = {
  search?: string;
  availability?: ZoneAvailabilityFilter;
  sort?: ZoneSort;
};

export const zonesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getZones: builder.query<Zone[], GetZonesParams | void>({
      query: (params) => ({
        url: "/api/zones",
        params: params
          ? {
              search: params.search || undefined,
              availability: params.availability === "all" ? undefined : params.availability,
              sort: params.sort === "recommended" ? undefined : params.sort,
            }
          : undefined,
      }),
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
