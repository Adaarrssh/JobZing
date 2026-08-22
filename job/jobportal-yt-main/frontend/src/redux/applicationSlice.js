import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: null,
  },
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },
    updateApplicantStatus: (state, action) => {
      const { applicationId, status } = action.payload;
      if (state.applicants && state.applicants.applications) {
        state.applicants.applications = state.applicants.applications.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        );
      }
    },
  },
});

export const { setAllApplicants, updateApplicantStatus } = applicationSlice.actions;
export default applicationSlice.reducer;