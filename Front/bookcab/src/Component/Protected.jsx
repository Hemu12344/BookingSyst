import React from "react";
import { Outlet, Navigate } from "react-router-dom"; // Fixed import source
import { useLocation } from "react-router-dom"; // Added for better redirects

export const Protected = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirect to /login while remembering where they came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};