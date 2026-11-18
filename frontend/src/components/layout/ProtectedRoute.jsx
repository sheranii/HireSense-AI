import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { homeForRole } from "../../lib/roles";

export const ProtectedRoute = ({ allow, children }) => {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-sm text-ink-600">
        Opening your workspace…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allow && !allow.includes(role)) {
    return <Navigate to={homeForRole(role)} replace />;
  }

  return children;
};
