import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("auth_user")
      ? JSON.parse(localStorage.getItem("auth_user"))
      : null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("auth_user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("auth_user");
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
