import { createSlice } from "@reduxjs/toolkit";
import { getStoredCompanies, saveStoredCompanies } from "@/utils/mockData";

const initialCompanies = getStoredCompanies();

const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    companies: initialCompanies,
    searchCompanyByText: "",
  },
  reducers: {
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
      saveStoredCompanies(action.payload);
    },
    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload;
    },
    addCompany: (state, action) => {
      state.companies = [action.payload, ...state.companies];
      saveStoredCompanies(state.companies);
    },
    updateCompany: (state, action) => {
      const updated = action.payload;
      state.companies = state.companies.map((c) =>
        c._id === updated._id ? { ...c, ...updated } : c
      );
      if (state.singleCompany && state.singleCompany._id === updated._id) {
        state.singleCompany = { ...state.singleCompany, ...updated };
      }
      saveStoredCompanies(state.companies);
    },
  },
});

export const {
  setSingleCompany,
  setCompanies,
  setSearchCompanyByText,
  addCompany,
  updateCompany,
} = companySlice.actions;

export default companySlice.reducer;