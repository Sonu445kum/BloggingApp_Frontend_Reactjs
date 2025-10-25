// src/pages/Admin/Dashboard.jsx
import React from "react";
import { useGetDashboardStatsQuery, useMostActiveUsersQuery, useGetTrendingBlogsQuery } from "../../api/apiSlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const StatsCard = ({ title, value }) => (
  <div className="bg-white shadow rounded p-4 flex flex-col items-center">
    <h2 className="text-lg font-bold">{title}</h2>
    <p className="text-2xl mt-2">{value}</p>
  </div>
);

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: activeUsers, isLoading: usersLoading } = useMostActiveUsersQuery();
  const { data: trendingBlogs, isLoading: blogsLoading } = useGetTrendingBlogsQuery();

  if (statsLoading || usersLoading || blogsLoading) return <p>Loading dashboard...</p>;

  // Example chart data: blogs per category
  const blogsPerCategory = trendingBlogs.reduce((acc, blog) => {
    const cat = blog.category.name;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += 1;
    return acc;
  }, {});

  const chartData = Object.entries(blogsPerCategory).map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Users" value={stats.users} />
        <StatsCard title="Blogs" value={stats.blogs} />
        <StatsCard title="Comments" value={stats.comments} />
        <StatsCard title="Reactions" value={stats.reactions} />
        <StatsCard title="Categories" value={stats.categories} />
      </div>

      {/* Most Active Users */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold mb-2">Most Active Users</h2>
        <ul>
          {activeUsers.map((user) => (
            <li key={user.id} className="border-b py-2 flex justify-between">
              <span>{user.username}</span>
              <span>Activity: {user.activity_count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trending Blogs */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold mb-2">Trending Blogs</h2>
        <ul>
          {trendingBlogs.slice(0, 5).map((blog) => (
            <li key={blog.id} className="border-b py-2 flex justify-between">
              <span>{blog.title}</span>
              <span>Views: {blog.views}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chart: Blogs per Category */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold mb-2">Blogs per Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
