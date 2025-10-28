// import React from "react";
// import {
//   useGetDashboardStatsQuery,
//   useMostActiveUsersQuery,
//   useGetTrendingBlogsQuery,
// } from "../../api/apiSlice";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// const Dashboard = () => {
//   const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
//   const { data: activeUsers, isLoading: usersLoading } = useMostActiveUsersQuery();
//   const { data: trendingBlogs, isLoading: blogsLoading } = useGetTrendingBlogsQuery();

//   if (statsLoading || usersLoading || blogsLoading)
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-xl">
//         Loading dashboard...
//       </div>
//     );

//   const safeTrendingBlogs = trendingBlogs || [];
//   const safeActiveUsers = activeUsers || [];

//   const blogsPerCategory = safeTrendingBlogs.reduce((acc, blog) => {
//     const cat = blog?.category?.name || "Uncategorized";
//     acc[cat] = (acc[cat] || 0) + 1;
//     return acc;
//   }, {});
//   const chartData = Object.entries(blogsPerCategory).map(([name, count]) => ({ name, count }));

//   return (
//     <div className="min-h-screen flex flex-col p-8 space-y-8 bg-gray-50 dark:bg-gray-900">
//       <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200">Dashboard</h1>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//         {[
//           { title: "Users", value: stats?.users ?? 0 },
//           { title: "Blogs", value: stats?.blogs ?? 0 },
//           { title: "Comments", value: stats?.comments ?? 0 },
//           { title: "Reactions", value: stats?.reactions ?? 0 },
//           { title: "Categories", value: stats?.categories ?? 0 },
//           { title: "Notifications", value: stats?.notifications ?? 0 },
//         ].map((stat) => (
//           <div
//             key={stat.title}
//             className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl rounded-xl p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 cursor-pointer"
//           >
//             <h2 className="text-lg font-semibold">{stat.title}</h2>
//             <p className="text-3xl font-bold mt-2">{stat.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Most Active Users */}
//       <div className="bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 shadow-xl rounded-2xl p-6 mb-8 hover:shadow-2xl transition-all duration-300">
//         <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 pb-2">
//           Most Active Users
//         </h2>
//         <ul className="space-y-2">
//           {safeActiveUsers.map((user) => (
//             <li
//               key={user.id}
//               className="flex justify-between items-center p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
//             >
//               <span className="font-medium text-gray-800 dark:text-gray-200">{user.username ?? "Unknown"}</span>
//               <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
//                 Activity: {user.activity_count ?? 0}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Trending Blogs */}
//       <div className="bg-gradient-to-r from-purple-100 via-purple-200 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 shadow-xl rounded-2xl p-6 mb-8 hover:shadow-2xl transition-all duration-300">
//         <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 pb-2">
//           Trending Blogs
//         </h2>
//         <ul className="space-y-2">
//           {safeTrendingBlogs.slice(0, 5).map((blog) => (
//             <li
//               key={blog.id}
//               className="flex justify-between items-center p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
//             >
//               <span className="font-medium text-gray-800 dark:text-gray-200">{blog.title ?? "Untitled"}</span>
//               <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
//                 Views: {blog.views ?? 0}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chart: Blogs per Category */}
//       <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300">
//         <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
//           Blogs per Category
//         </h2>
//         <ResponsiveContainer width="100%" height={350}>
//           <BarChart data={chartData}>
//             <XAxis dataKey="name" stroke="#4B5563" />
//             <YAxis stroke="#4B5563" />
//             <Tooltip />
//             <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React from "react";
import {
  useGetDashboardStatsQuery,
  useMostActiveUsersQuery,
  useGetTrendingBlogsQuery,
} from "../../api/apiSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

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

  /* 🔹 Fix: Proper Category Detection */
const blogsPerCategory = safeTrendingBlogs.reduce((acc, blog) => {
  const categoryName =
    blog?.category?.name?.trim() && blog.category.name !== "Uncategorized"
      ? blog.category.name
      : "No Category";
  acc[categoryName] = (acc[categoryName] || 0) + 1;
  return acc;
}, {});

const categoryChartData = Object.entries(blogsPerCategory).map(([name, count]) => ({
  name,
  count,
}));


  /* 🔹 Overall Stats */
  const overviewData = [
    { name: "Users", value: stats?.users ?? 0 },
    { name: "Blogs", value: stats?.blogs ?? 0 },
    { name: "Comments", value: stats?.comments ?? 0 },
    { name: "Reactions", value: stats?.reactions ?? 0 },
    { name: "Categories", value: stats?.categories ?? 0 },
    { name: "Notifications", value: stats?.notifications ?? 0 },
  ];

  /* 🔹 Category % Distribution for Pie */
  const totalBlogs = categoryChartData.reduce((sum, cat) => sum + cat.count, 0);
  const categoryPercentageData = categoryChartData.map((cat) => ({
    name: cat.name,
    value: ((cat.count / totalBlogs) * 100).toFixed(2),
  }));

  /* 🔹 Simulated Growth Over Time (Line Chart) */
  const growthData = [
    { month: "Jan", blogs: 20 },
    { month: "Feb", blogs: 45 },
    { month: "Mar", blogs: 60 },
    { month: "Apr", blogs: 80 },
    { month: "May", blogs: 120 },
    { month: "Jun", blogs: stats?.blogs ?? 150 },
  ];

  const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];

  return (
    <div className="min-h-screen flex flex-col p-8 space-y-10 bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      <motion.h1
        className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Admin Dashboard
      </motion.h1>

      {/* 🔸 Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {overviewData.map((stat, i) => (
          <motion.div
            key={stat.name}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <h2 className="text-lg font-semibold">{stat.name}</h2>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 🔹 Overall Stats Chart */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
          Overview Analytics
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={overviewData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 🔹 Blogs per Category */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
          Blogs per Category
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={categoryChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      
      {/* 🔹 Growth Trend (Line Chart) */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
          Blog Growth Over Time
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="blogs" stroke="#10B981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Dashboard;


// add the most active user and trending blogs












