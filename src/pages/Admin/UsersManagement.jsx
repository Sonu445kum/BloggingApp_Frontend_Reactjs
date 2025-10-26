// src/pages/Admin/UsersManagement.jsx
import React, { useState } from "react";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "../../api/apiSlice";
import { toast } from "react-toastify";

const UsersManagement = () => {
  const { data: users, isLoading, refetch } = useGetUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [loadingUserId, setLoadingUserId] = useState(null);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-xl">
        Loading users...
      </div>
    );

  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoadingUserId(userId);
      await updateUserRole({ userId, role: newRole }).unwrap();
      toast.success("Role updated successfully");
      refetch(); // refresh user list
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-100 to-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Users Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 font-medium text-gray-700">{user.id}</td>
                <td className="py-3 px-6 font-medium text-gray-800">{user.username}</td>
                <td className="py-3 px-6 text-gray-600">{user.email}</td>
                <td className="py-3 px-6 font-medium text-gray-700">{user.role}</td>
                <td className="py-3 px-6">
                  <select
                    className={`border rounded px-3 py-1 ${
                      loadingUserId === user.id
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-white"
                    } transition-colors duration-200`}
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={loadingUserId === user.id}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Author">Author</option>
                    <option value="Reader">Reader</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagement;
