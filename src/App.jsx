import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import { Login, Register } from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Recommendations from "./pages/Recommendations";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Bookmarks from "./pages/Bookmarks";
import Notifications from "./pages/Notifications";
import SearchHistory from "./pages/SearchHistory";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetails />} />
            <Route path="companies" element={<Companies />} />
            <Route path="companies/:id" element={<CompanyDetails />} />

            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="resume" element={<Resume />} />
              <Route path="profile" element={<Profile />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="search-history" element={<SearchHistory />} />
            </Route>

            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
