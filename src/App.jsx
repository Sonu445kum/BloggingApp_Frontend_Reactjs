import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Pages
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";

// Blogs
import BlogList from "./pages/Blogs/BlogList";
import BlogDetail from "./pages/Blogs/BlogDetail";
import BlogCreate from "./pages/Blogs/BlogCreate";
import BlogEdit from "./pages/Blogs/BlogEdit";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import UsersManagement from "./pages/Admin/UsersManagement";
import CategoriesManagement from "./pages/Admin/CategoriesManagement";
import CommentsManagement from "./pages/Admin/CommentsManagement";
import NotificationsManagement from "./pages/Admin/NotificationsManagement";
import BlogsManagement from "./pages/Admin/BlogsManagement";

// Layout to handle Footer visibility
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  const hideFooterPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/verify-email",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">{children}</main>
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Public Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/auth/change-password" element={<ChangePassword />} />
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
      </Layout>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;
