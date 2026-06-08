import { baseApi } from "@/app/store/baseApi";
import type { Review } from "@/types/domain";
import type { ReviewFormValues } from "@/features/reviews/schemas/review.schemas";

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<Review[], void>({
      query: () => ({ url: "/api/avis" }),
      providesTags: ["Review"],
    }),
    createReview: builder.mutation<Review, ReviewFormValues>({
      query: (data) => ({ url: "/api/avis", method: "POST", data }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const { useCreateReviewMutation, useGetReviewsQuery } = reviewsApi;
