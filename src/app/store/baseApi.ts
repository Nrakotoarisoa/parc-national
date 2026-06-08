import type { AxiosError, AxiosRequestConfig } from "axios";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { apiClient } from "@/lib/api-client";
import type { RootState } from "@/app/store/store";
import type { ApiError } from "@/types/api";

type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
};

type BaseQueryError = {
  status: number;
  data: ApiError;
};

const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, BaseQueryError> =>
  async ({ url, method = "GET", data, params }, api) => {
    const token = (api.getState() as RootState).auth.token;

    try {
      const result = await apiClient.request({
        url,
        method,
        data,
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      return { data: result.data };
    } catch (axiosError) {
      const error = axiosError as AxiosError<ApiError>;

      return {
        error: {
          status: error.response?.status ?? 500,
          data: error.response?.data ?? {
            message: "Une erreur inattendue est survenue.",
          },
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Auth", "Zone", "Activity", "Reservation", "Review", "AdminStats"],
  endpoints: () => ({}),
});
