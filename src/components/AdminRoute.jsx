import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // set role during login if backend provides

  return token && role === 'Admin' ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default AdminRoute;
