// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { apiSlice, useCurrentUserQuery } from "./api/apiSlice";
import { setUser } from "./api/authSlice";

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

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ChangePassword from "./pages/Auth/ChangePassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";

// Blog Pages
import BlogList from "./pages/Blogs/BlogList";
import BlogDetail from "./pages/Blogs/BlogDetail";
import BlogCreate from "./pages/Blogs/BlogCreate";
import BlogEdit from "./pages/Blogs/BlogEdit";
import BlogSearch from "./pages/Blogs/BlogSearch";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import UsersManagement from "./pages/Admin/UsersManagement";
import CategoriesManagement from "./pages/Admin/CategoriesManagement";
import CommentsManagement from "./pages/Admin/CommentsManagement";
import NotificationsManagement from "./pages/Admin/NotificationsManagement";
import BlogsManagement from "./pages/Admin/BlogsManagement";

// Profile Pages
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";

// Layout wrapper for Navbar + Footer control
const Layout = ({ children }) => {
  const location = useLocation();

  // Hide footer on specific pages
  const hideFooterPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
  ];

  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">{children}</main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

// AppContent: Handles fetching current user & setting auth state
const AppContent = () => {
   const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  //  Only fetch if token exists
  const { data, error } = useCurrentUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    } else if (error && error.status === 401) {
      console.warn("⚠️ Token invalid or expired. Logging out.");
      dispatch({ type: "auth/logout" });
    }
  }, [data, error, dispatch]);

  return (
    <Routes>
      {/* Landing & Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Blog Routes */}
      <Route path="/blogs" element={<BlogList />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      <Route path="/blogs/search" element={<BlogSearch />} />

      {/* Auth Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />

      {/* Profile Routes */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<ProfileEdit />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/auth/change-password" element={<ChangePassword />} />
        <Route path="/blogs/create" element={<BlogCreate />} />
        <Route path="/blogs/edit/:id" element={<BlogEdit />} />
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
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <AppContent />
      </Layout>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;
