import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/app/store/baseApi";
import authReducer from "@/features/auth/slices/authSlice";
import discoveryReducer from "@/features/discovery/slices/discoverySlice";
import zoneFavoritesReducer from "@/features/zones/slices/zoneFavoritesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    discovery: discoveryReducer,
    zoneFavorites: zoneFavoritesReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
