import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SidebarLink = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
        isActive ? "bg-gray-300 dark:bg-gray-800 font-bold" : ""
      }`
    }
  >
    {label}
  </NavLink>
);

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const username = localStorage.getItem("username") || "Admin";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`bg-white dark:bg-gray-800 shadow h-screen transition-all ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`font-bold text-lg ${!sidebarOpen ? "hidden" : ""}`}>Admin Panel</h2>
          <button
            className="text-gray-600 dark:text-gray-300"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="mt-4">
          <SidebarLink to="/admin/dashboard" label="Dashboard" />
          <SidebarLink to="/admin/users" label="Users Management" />
          <SidebarLink to="/admin/blogs" label="Blogs Management" />
          <SidebarLink to="/admin/categories" label="Categories Management" />
          <SidebarLink to="/admin/comments" label="Comments Management" />
          <SidebarLink to="/admin/notifications" label="Notifications Management" />
          <SidebarLink to="/admin/reactions" label="Reactions Management" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="flex justify-end items-center bg-white dark:bg-gray-800 shadow px-4 py-3">
          <div className="relative inline-block text-left">
            <button
              className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              id="menu-button"
            >
              {username} ▼
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow rounded z-50">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
