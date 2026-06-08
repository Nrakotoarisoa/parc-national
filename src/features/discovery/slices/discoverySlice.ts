import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type DiscoveryState = {
  search: string;
  selectedZoneId: number | null;
  priceRange: [number, number];
};

const initialState: DiscoveryState = {
  search: "",
  selectedZoneId: null,
  priceRange: [0, 500],
};

const discoverySlice = createSlice({
  name: "discovery",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSelectedZone: (state, action: PayloadAction<number | null>) => {
      state.selectedZoneId = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
  },
});

export const { setPriceRange, setSearch, setSelectedZone } = discoverySlice.actions;
export default discoverySlice.reducer;
