import React from 'react';
import { useGetUsersQuery } from '../../api/apiSlice';
import Loader from '../../components/Loader';

const UsersManagement = () => {
  const { data: users, isLoading } = useGetUsersQuery();

  if (isLoading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6 font-bold">Users Management</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
