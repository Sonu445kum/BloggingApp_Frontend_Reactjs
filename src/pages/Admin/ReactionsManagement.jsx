// src/pages/Admin/ReactionsManagement.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetAllReactionsQuery,
  useDeleteReactionMutation,
} from "../../api/apiSlice";

const ReactionsManagement = () => {
  const { data: reactions, isLoading, refetch } = useGetAllReactionsQuery();
  const [deleteReaction] = useDeleteReactionMutation();
  const [loadingId, setLoadingId] = useState(null);

  if (isLoading) return <p>Loading reactions...</p>;

  const handleDelete = async (id) => {
    try {
      setLoadingId(id);
      await deleteReaction(id).unwrap();
      toast.success("Reaction deleted");
      refetch();
    } catch {
      toast.error("Failed to delete reaction");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reactions Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Blog</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reactions.map((reaction) => (
              <tr key={reaction.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{reaction.id}</td>
                <td className="py-2 px-4">{reaction.user.username}</td>
                <td className="py-2 px-4">{reaction.blog.title}</td>
                <td className="py-2 px-4">{reaction.type}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    onClick={() => handleDelete(reaction.id)}
                    disabled={loadingId === reaction.id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReactionsManagement;
