import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ProtectedRoutes = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    toast.error("Please Login to Continue", { duration: 3000 });
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
