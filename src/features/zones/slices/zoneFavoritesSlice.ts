import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ZoneFavoritesState = {
  ids: number[];
};

const initialState: ZoneFavoritesState = {
  ids: [],
};

const zoneFavoritesSlice = createSlice({
  name: "zoneFavorites",
  initialState,
  reducers: {
    toggleZoneFavorite: (state, action: PayloadAction<number>) => {
      const zoneId = action.payload;
      state.ids = state.ids.includes(zoneId) ? state.ids.filter((id) => id !== zoneId) : [...state.ids, zoneId];
    },
  },
});

export const { toggleZoneFavorite } = zoneFavoritesSlice.actions;
export default zoneFavoritesSlice.reducer;
