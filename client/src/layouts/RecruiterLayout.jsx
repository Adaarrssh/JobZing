import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";

const RecruiterLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "recruiter") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="recruiter-layout">
      <Navbar />
      <main className="recruiter-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RecruiterLayout;
