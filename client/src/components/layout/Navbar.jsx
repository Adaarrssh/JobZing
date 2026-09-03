import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout?.();
    setMobileOpen(false);
    navigate("/login");
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobile}>
          JobZing
        </Link>

        <nav className="navbar-links">
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
          >
            <BriefcaseBusiness size={18} />
            Jobs
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/bookmarks"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "active" : ""}`
                }
              >
                <Bookmark size={18} />
                Bookmarks
              </NavLink>

              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "active" : ""}`
                }
              >
                <Bell size={18} />
                Notifications
              </NavLink>
            </>
          )}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <>
              <button
                type="button"
                className="navbar-profile"
                onClick={() => navigate("/profile")}
              >
                <User size={18} />
                <span>
                  {user.name || user.username || user.email || "Profile"}
                </span>
              </button>

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-login">
                Login
              </Link>

              <Link to="/register" className="navbar-register">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="navbar-mobile-menu">
          <NavLink
            to="/jobs"
            onClick={closeMobile}
            className={({ isActive }) =>
              `navbar-mobile-link ${isActive ? "active" : ""}`
            }
          >
            <BriefcaseBusiness size={18} />
            Jobs
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/bookmarks"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `navbar-mobile-link ${isActive ? "active" : ""}`
                }
              >
                <Bookmark size={18} />
                Bookmarks
              </NavLink>

              <NavLink
                to="/notifications"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `navbar-mobile-link ${isActive ? "active" : ""}`
                }
              >
                <Bell size={18} />
                Notifications
              </NavLink>

              <NavLink
                to="/profile"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `navbar-mobile-link ${isActive ? "active" : ""}`
                }
              >
                <User size={18} />
                Profile
              </NavLink>

              <button
                type="button"
                className="navbar-mobile-logout"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}

          {!user && (
            <div className="navbar-mobile-auth">
              <Link to="/login" onClick={closeMobile}>
                Login
              </Link>

              <Link to="/register" onClick={closeMobile}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
