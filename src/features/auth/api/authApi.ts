import { baseApi } from "@/app/store/baseApi";
import type { User } from "@/types/domain";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/features/auth/types/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({ url: "/api/auth/login", method: "POST", data }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({ url: "/api/auth/register", method: "POST", data }),
      invalidatesTags: ["Auth"],
    }),
    me: builder.query<User, void>({
      query: () => ({ url: "/api/auth/me" }),
      providesTags: ["Auth"],
    }),
    getUser: builder.query<User, number>({
      query: (id) => ({ url: `/api/users/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Auth" as const, id }],
    }),
    updateProfile: builder.mutation<User, Partial<Pick<User, "nom">> & { mot_de_passe?: string }>({
      query: (data) => ({ url: "/api/users/profile", method: "PUT", data }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useMeQuery, useGetUserQuery, useUpdateProfileMutation } = authApi;
