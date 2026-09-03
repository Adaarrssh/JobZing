import React from "react";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../api/auth.api";
import { getToken, removeToken, setToken } from "../utils/storage";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await getCurrentUser();
      setUser(response?.data?.user || response?.user || response?.data || null);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const token = response?.data?.token || response?.token;

    const loggedInUser = response?.data?.user || response?.user;

    if (token) {
      setToken(token);
    }

    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      await fetchUser();
    }

    return response;
  };

  const register = async (userData) => {
    const response = await registerUser(userData);

    const token = response?.data?.token || response?.token;

    const registeredUser = response?.data?.user || response?.user;

    if (token) {
      setToken(token);
    }

    if (registeredUser) {
      setUser(registeredUser);
    } else if (token) {
      await fetchUser();
    }

    return response;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
    } finally {
      removeToken();
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser: fetchUser,
    }),
    [user, loading, fetchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
