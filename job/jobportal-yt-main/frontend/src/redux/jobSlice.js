import { createSlice } from "@reduxjs/toolkit";
import { getStoredJobs, saveStoredJobs, getStoredSavedJobs, saveStoredSavedJobs } from "@/utils/mockData";

const initialJobs = getStoredJobs();
const initialSaved = getStoredSavedJobs();

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: initialJobs,
    allAdminJobs: initialJobs.filter((job) => job.source === "JobZing Direct" || job.created_by === "user_recruiter_1"),
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: initialJobs.flatMap((job) =>
      (job.applications || []).map((app) => ({
        ...app,
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          salary: job.salary,
          location: job.location,
          jobType: job.jobType,
          createdAt: job.createdAt,
          source: job.source,
          sourcePortal: job.sourcePortal,
        },
      }))
    ),
    searchedQuery: "",
    savedJobIds: initialSaved,
    // Independent Multi-Faceted Filters
    selectedPortal: "All",
    filterLocation: "All",
    filterRole: "All",
    filterSalary: "All",
    filterExperience: "All",
    isFetchingApiJobs: false,
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
      saveStoredJobs(action.payload);
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    setSelectedPortal: (state, action) => {
      state.selectedPortal = action.payload;
    },
    setFilterLocation: (state, action) => {
      state.filterLocation = action.payload;
    },
    setFilterRole: (state, action) => {
      state.filterRole = action.payload;
    },
    setFilterSalary: (state, action) => {
      state.filterSalary = action.payload;
    },
    setFilterExperience: (state, action) => {
      state.filterExperience = action.payload;
    },
    resetAllFilters: (state) => {
      state.selectedPortal = "All";
      state.filterLocation = "All";
      state.filterRole = "All";
      state.filterSalary = "All";
      state.filterExperience = "All";
      state.searchedQuery = "";
    },
    setIsFetchingApiJobs: (state, action) => {
      state.isFetchingApiJobs = action.payload;
    },
    addFetchedApiJobs: (state, action) => {
      const newJobs = action.payload;
      const existingIds = new Set(state.allJobs.map((j) => j._id));
      const filteredNew = newJobs.filter((j) => !existingIds.has(j._id));
      state.allJobs = [...filteredNew, ...state.allJobs];
      saveStoredJobs(state.allJobs);
    },
    addJob: (state, action) => {
      const newJob = action.payload;
      state.allJobs = [newJob, ...state.allJobs];
      state.allAdminJobs = [newJob, ...state.allAdminJobs];
      saveStoredJobs(state.allJobs);
    },
    applyToJobAction: (state, action) => {
      const { jobId, application } = action.payload;
      state.allJobs = state.allJobs.map((job) => {
        if (job._id === jobId) {
          const existingApps = job.applications || [];
          const updatedApps = [...existingApps, application];
          return { ...job, applications: updatedApps };
        }
        return job;
      });

      if (state.singleJob && state.singleJob._id === jobId) {
        state.singleJob = {
          ...state.singleJob,
          applications: [...(state.singleJob.applications || []), application],
        };
      }

      state.allAdminJobs = state.allAdminJobs.map((job) => {
        if (job._id === jobId) {
          const existingApps = job.applications || [];
          return { ...job, applications: [...existingApps, application] };
        }
        return job;
      });

      const matchedJob = state.allJobs.find((j) => j._id === jobId);
      if (matchedJob) {
        const newAppliedEntry = {
          ...application,
          job: {
            _id: matchedJob._id,
            title: matchedJob.title,
            company: matchedJob.company,
            salary: matchedJob.salary,
            location: matchedJob.location,
            jobType: matchedJob.jobType,
            createdAt: matchedJob.createdAt,
            source: matchedJob.source,
            sourcePortal: matchedJob.sourcePortal,
          },
        };
        state.allAppliedJobs = [newAppliedEntry, ...state.allAppliedJobs];
      }

      saveStoredJobs(state.allJobs);
    },
    updateJobApplicationStatus: (state, action) => {
      const { applicationId, status } = action.payload;
      state.allJobs = state.allJobs.map((job) => {
        if (job.applications) {
          const updatedApps = job.applications.map((app) =>
            app._id === applicationId ? { ...app, status } : app
          );
          return { ...job, applications: updatedApps };
        }
        return job;
      });

      state.allAdminJobs = state.allAdminJobs.map((job) => {
        if (job.applications) {
          const updatedApps = job.applications.map((app) =>
            app._id === applicationId ? { ...app, status } : app
          );
          return { ...job, applications: updatedApps };
        }
        return job;
      });

      state.allAppliedJobs = state.allAppliedJobs.map((app) =>
        app._id === applicationId ? { ...app, status } : app
      );

      saveStoredJobs(state.allJobs);
    },
    toggleSaveJob: (state, action) => {
      const jobId = action.payload;
      if (state.savedJobIds.includes(jobId)) {
        state.savedJobIds = state.savedJobIds.filter((id) => id !== jobId);
      } else {
        state.savedJobIds.push(jobId);
      }
      saveStoredSavedJobs(state.savedJobIds);
    },
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setSelectedPortal,
  setFilterLocation,
  setFilterRole,
  setFilterSalary,
  setFilterExperience,
  resetAllFilters,
  setIsFetchingApiJobs,
  addFetchedApiJobs,
  addJob,
  applyToJobAction,
  updateJobApplicationStatus,
  toggleSaveJob,
} = jobSlice.actions;

export default jobSlice.reducer;