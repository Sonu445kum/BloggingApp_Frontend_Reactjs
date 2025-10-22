import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ChangePassword from './pages/auth/ChangePassword';
import BlogList from './pages/blogs/BlogList';
import BlogDetail from './pages/blogs/BlogDetail';
import BlogCreate from './pages/blogs/BlogCreate';
import BlogEdit from './pages/blogs/BlogEdit';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import UsersManagement from './pages/admin/UsersManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import CommentsManagement from './pages/admin/CommentsManagement';
import NotificationsManagement from './pages/admin/NotificationsManagement';
import BlogsManagement from './pages/admin/BlogsManagement';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/auth/change-password" element={<ChangePassword />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/create" element={<BlogCreate />} />
          <Route path="/blogs/edit/:id" element={<BlogEdit />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/categories" element={<CategoriesManagement />} />
          <Route path="/admin/comments" element={<CommentsManagement />} />
          <Route path="/admin/notifications" element={<NotificationsManagement />} />
          <Route path="/admin/blogs" element={<BlogsManagement />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;
