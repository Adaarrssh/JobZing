import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api, { unwrap } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("jobzing_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("jobzing_token")),
  );

  useEffect(() => {
    const token = localStorage.getItem("jobzing_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => {
        const nextUser = unwrap(response);

        setUser(nextUser);
        localStorage.setItem("jobzing_user", JSON.stringify(nextUser));
      })
      .catch(() => {
        localStorage.removeItem("jobzing_token");
        localStorage.removeItem("jobzing_user");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });

    if (response?.data?.success === false) {
      const error = new Error(response.data.message || "Unable to sign in.");
      error.response = response;
      throw error;
    }

    const data = unwrap(response);

    if (!data?.token || !data?.user) {
      throw new Error("Unable to sign in. Please try again.");
    }

    localStorage.setItem("jobzing_token", data.token);
    localStorage.setItem("jobzing_user", JSON.stringify(data.user));
    setUser(data.user);

    return data.user;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);

    const data = unwrap(response);

    localStorage.setItem("jobzing_token", data.token);
    localStorage.setItem("jobzing_user", JSON.stringify(data.user));

    setUser(data.user);

    return data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      console.warn("Logout request failed on the server.");
    }

    localStorage.removeItem("jobzing_token");
    localStorage.removeItem("jobzing_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
