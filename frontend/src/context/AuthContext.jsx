import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

function authFailureMessage(err, fallback) {
  if (!err.response) {
    return "The HireSense server is not running, so this request never reached an account. PostgreSQL has to be started before the backend can accept registrations.";
  }
  const data = err.response.data;
  if (data?.message) return data.message;
  if (data && typeof data === "object") {
    const first = Object.values(data).find((value) => typeof value === "string");
    if (first) return first;
  }
  return fallback;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("hiresense_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("hiresense_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem("hiresense_token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem("hiresense_token");
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("hiresense_user", JSON.stringify(user));
    else localStorage.removeItem("hiresense_user");
  }, [user]);

  useEffect(() => {
    const storedToken = localStorage.getItem("hiresense_token");
    if (!storedToken) {
      setLoading(false);
      return;
    }
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data);
        setToken(storedToken);
      })
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (err) {
      return { success: false, error: authFailureMessage(err, "Sign-in failed. Check the email and password.") };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      setToken(response.data.token);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (err) {
      return { success: false, error: authFailureMessage(err, "Registration failed.") };
    }
  };

  const updateProfile = async (updates) => {
    const response = await api.patch("/auth/me", updates);
    setUser(response.data);
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
