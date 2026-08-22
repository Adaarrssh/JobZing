import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
          profile: {
            ...(state.user.profile || {}),
            ...(action.payload.profile || {}),
          },
        };
      }
    },
  },
});

export const { setLoading, setUser, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;