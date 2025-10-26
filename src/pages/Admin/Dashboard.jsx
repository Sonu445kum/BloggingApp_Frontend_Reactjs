// src/pages/Admin/Dashboard.jsx
import React from "react";
import {
  useGetDashboardStatsQuery,
  useMostActiveUsersQuery,
  useGetTrendingBlogsQuery,
} from "../../api/apiSlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: activeUsers, isLoading: usersLoading } = useMostActiveUsersQuery();
  const { data: trendingBlogs, isLoading: blogsLoading } = useGetTrendingBlogsQuery();

  if (statsLoading || usersLoading || blogsLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-xl">
        Loading dashboard...
      </div>
    );

  const safeTrendingBlogs = trendingBlogs || [];
  const safeActiveUsers = activeUsers || [];

  const blogsPerCategory = safeTrendingBlogs.reduce((acc, blog) => {
    const cat = blog?.category?.name || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(blogsPerCategory).map(([name, count]) => ({ name, count }));

  return (
    <div className="min-h-screen flex flex-col p-8 space-y-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          { title: "Users", value: stats?.users ?? 0 },
          { title: "Blogs", value: stats?.blogs ?? 0 },
          { title: "Comments", value: stats?.comments ?? 0 },
          { title: "Reactions", value: stats?.reactions ?? 0 },
          { title: "Categories", value: stats?.categories ?? 0 },
        ].map((stat) => (
          <div
            key={stat.title}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl rounded-xl p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <h2 className="text-lg font-semibold">{stat.title}</h2>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Most Active Users */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">
          Most Active Users
        </h2>
        <ul className="space-y-2">
          {safeActiveUsers.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
            >
              <span className="font-medium text-gray-800">{user.username ?? "Unknown"}</span>
              <span className="text-gray-500 text-sm">Activity: {user.activity_count ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trending Blogs */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">
          Trending Blogs
        </h2>
        <ul className="space-y-2">
          {safeTrendingBlogs.slice(0, 5).map((blog) => (
            <li
              key={blog.id}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 cursor-pointer"
            >
              <span className="font-medium text-gray-800">{blog.title ?? "Untitled"}</span>
              <span className="text-gray-500 text-sm">Views: {blog.views ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chart: Blogs per Category */}
      <div className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">
          Blogs per Category
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#4B5563" />
            <YAxis stroke="#4B5563" />
            <Tooltip />
            <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
