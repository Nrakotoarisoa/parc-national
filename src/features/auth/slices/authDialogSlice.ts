import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthDialogMode = "login" | "register";

type AuthDialogState = {
  isOpen: boolean;
  mode: AuthDialogMode;
  redirectTo?: string;
};

const initialState: AuthDialogState = {
  isOpen: false,
  mode: "login",
};

const authDialogSlice = createSlice({
  name: "authDialog",
  initialState,
  reducers: {
    openAuthDialog: (state, action: PayloadAction<{ mode?: AuthDialogMode; redirectTo?: string } | undefined>) => {
      state.isOpen = true;
      state.mode = action.payload?.mode ?? "login";
      state.redirectTo = action.payload?.redirectTo;
    },
    closeAuthDialog: (state) => {
      state.isOpen = false;
      state.redirectTo = undefined;
    },
    setAuthDialogMode: (state, action: PayloadAction<AuthDialogMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { closeAuthDialog, openAuthDialog, setAuthDialogMode } = authDialogSlice.actions;
export default authDialogSlice.reducer;
