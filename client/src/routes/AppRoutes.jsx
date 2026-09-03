import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/mainLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/home/Home";
import Jobs from "../pages/jobs/Jobs";
import JobDetails from "../pages/jobs/JobDetails";

import Dashboard from "../pages/dashboard/Dashboard";
import Bookmarks from "../pages/bookmark/Bookmarks";
import Notifications from "../pages/notifications/Notifications";
import Profile from "../pages/profile/Profile";
import Resume from "../pages/resume/Resume";
import SearchHistory from "../pages/searchHistory/SearchHistory";

import Recruiter from "../pages/recruiter/Recruiter";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/search-history" element={<SearchHistory />} />
        </Route>

        <Route element={<RecruiterLayout />}>
          <Route path="/recruiter" element={<Recruiter />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
