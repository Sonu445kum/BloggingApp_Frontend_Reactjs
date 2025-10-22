import React from 'react';
import { useGetUsersQuery, useGetBlogsQuery } from '../../api/apiSlice';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const { data: users, isLoading: loadingUsers } = useGetUsersQuery();
  const { data: blogs, isLoading: loadingBlogs } = useGetBlogsQuery();

  if (loadingUsers || loadingBlogs) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6 font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-gray-700">{users.length}</p>
        </div>
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Blogs</h2>
          <p className="text-gray-700">{blogs.length}</p>
        </div>
        {/* Add more cards for comments, categories, notifications */}
      </div>
    </div>
  );
};

export default Dashboard;
