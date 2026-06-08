import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/app/store/baseApi";
import authReducer from "@/features/auth/slices/authSlice";
import discoveryReducer from "@/features/discovery/slices/discoverySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    discovery: discoveryReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
