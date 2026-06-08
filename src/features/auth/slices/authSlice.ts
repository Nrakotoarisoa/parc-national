import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/domain";

type AuthState = {
  token: string | null;
  user: User | null;
};

const initialState: AuthState = {
  token: localStorage.getItem("auth_token"),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("auth_token", action.payload.token);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("auth_token");
    },
  },
});

export const { logout, setCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;
