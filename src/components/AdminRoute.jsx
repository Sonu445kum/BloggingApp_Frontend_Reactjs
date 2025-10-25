import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Case-insensitive check
  const isAdmin = role && role.toLowerCase() === 'admin';

  return token && isAdmin ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default AdminRoute;
