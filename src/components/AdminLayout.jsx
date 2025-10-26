import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  Tag,
  MessageCircle,
  Bell,
  Heart,
} from "lucide-react";
import { useGetDashboardStatsQuery } from "../api/apiSlice";

// Sidebar Link Component
const SidebarLink = ({ to, label, icon: Icon, badge, sidebarOpen }) => (
  <div className="group relative">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md font-semibold"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1"
        }`
      }
    >
      {Icon && <Icon className="w-5 h-5" />}
      {sidebarOpen && <span className="flex-1">{label}</span>}
      {badge && sidebarOpen && (
        <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse">
          {badge}
        </span>
      )}
    </NavLink>

    {/* Tooltip for collapsed sidebar */}
    {!sidebarOpen && (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1 bg-gray-800 text-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm whitespace-nowrap">
        {label}
      </div>
    )}
  </div>
);

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: stats } = useGetDashboardStatsQuery();

  const badges = {
    users: stats?.users || 0,
    blogs: stats?.blogs || 0,
    categories: stats?.categories || 0,
    comments: stats?.comments || 0,
    notifications: stats?.notifications || 0,
    reactions: stats?.reactions || 0,
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`flex flex-col h-screen transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-indigo-50 via-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg`}
      >
        {/* Header */}
        {sidebarOpen && (
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Admin Dashboard
            </h1>
          </div>
        )}

        {/* Sidebar Links */}
        <nav className="mt-4 flex-1 space-y-1 px-1">
          <SidebarLink
            to="/admin/dashboard"
            label="Dashboard"
            icon={Home}
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            to="/admin/users"
            label="Users"
            icon={Users}
            badge={badges.users}
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            to="/admin/blogs"
            label="Blogs"
            icon={FileText}
            badge={badges.blogs}
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            to="/admin/categories"
            label="Categories"
            icon={Tag}
            badge={badges.categories}
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            to="/admin/comments"
            label="Comments"
            icon={MessageCircle}
            badge={badges.comments}
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            to="/admin/notifications"
            label="Notifications"
            icon={Bell}
            badge={badges.notifications}
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            to="/admin/reactions"
            label="Reactions"
            icon={Heart}
            badge={badges.reactions}
            sidebarOpen={sidebarOpen}
          />
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
            &copy; 2025 SonuBlogApp
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
