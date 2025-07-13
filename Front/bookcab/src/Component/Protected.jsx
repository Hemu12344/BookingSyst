import React from "react";
import { Outlet, Navigate } from "react-router";

export const Procted = () => {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
