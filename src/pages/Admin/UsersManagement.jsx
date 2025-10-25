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

  if (isLoading) return <p>Loading users...</p>;

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
    <div>
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{user.id}</td>
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">
                  <select
                    className="border rounded px-2 py-1"
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
