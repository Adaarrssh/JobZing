import { Bell, BriefcaseBusiness, Heart, LogIn, Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/helpers";
import api, { unwrap } from "../services/api";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setUnread(0);
      return;
    }

    api
      .get("/notifications")
      .then((response) => {
        const data = unwrap(response);

        const notifications = Array.isArray(data)
          ? data
          : data?.notifications || [];

        setUnread(
          notifications.filter((notification) => !notification.isRead).length,
        );
      })
      .catch(() => {
        setUnread(0);
      });
  }, [isAuthenticated]);

  const doLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  const links = isAuthenticated
    ? [
        ["/dashboard", "Dashboard"],
        ["/jobs", "Find Jobs"],
        ["/recommendations", "For You"],
        ["/resume", "Resume AI"],
        ["/companies", "Companies"],
      ]
    : [
        ["/jobs", "Find Jobs"],
        ["/companies", "Companies"],
      ];

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="nav-shell">
      <div className="container nav-inner">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark">
            <BriefcaseBusiness size={19} />
          </span>

          <span>
            Job<span>Zing</span>
          </span>
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          ))}

          {isAuthenticated && (
            <NavLink
              to="/bookmarks"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "active icon-link" : "icon-link"
              }
            >
              <Heart size={17} />
              Saved
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link
                className="nav-icon-btn"
                to="/notifications"
                aria-label="Notifications"
              >
                <Bell size={19} />

                {unread > 0 && <span className="notif-dot" />}
              </Link>

              <Link className="profile-chip" to="/profile" onClick={closeMenu}>
                <span>{getInitials(user?.fullName)}</span>

                <strong>{user?.fullName?.split(" ")[0] || "Profile"}</strong>
              </Link>

              <button
                className="ghost-icon"
                onClick={doLogout}
                aria-label="Log out"
                type="button"
              >
                <LogIn size={18} />
              </button>

              <button
                className="ghost-icon mobile-menu"
                onClick={() => setOpen(!open)}
                aria-label="Menu"
                type="button"
              >
                {open ? <X /> : <Menu />}
              </button>
            </>
          ) : (
            <>
              <Link className="nav-login" to="/login" onClick={closeMenu}>
                <LogIn size={17} />
                Sign in
              </Link>

              <Link
                className="btn btn-primary nav-register"
                to="/register"
                onClick={closeMenu}
              >
                Get started
              </Link>

              <button
                className="ghost-icon mobile-menu"
                onClick={() => setOpen(!open)}
                aria-label="Menu"
                type="button"
              >
                {open ? <X /> : <Menu />}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
