// src/pages/Admin/ReactionsManagement.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useGetAllReactionsQuery, useDeleteReactionMutation } from "../../api/apiSlice";

// Map reaction types to icons
const reactionIcons = {
  like: "👍",
  dislike: "👎",
  love: "❤️",
  laugh: "😂",
  angry: "😡",
  wow: "😲",
};

const ReactionsManagement = () => {
  const { data: reactions = [], isLoading, isError } = useGetAllReactionsQuery();
  const [deleteReaction] = useDeleteReactionMutation();
  const [loadingId, setLoadingId] = useState(null);

  if (isLoading) return <p className="text-gray-500">Loading reactions...</p>;
  if (isError) return <p className="text-red-500">Failed to load reactions.</p>;
  if (reactions.length === 0) return <p className="text-gray-500">No reactions found.</p>;

  const handleDelete = async (id) => {
    try {
      setLoadingId(id);
      await deleteReaction(id).unwrap();
      toast.success("Reaction deleted successfully");
    } catch {
      toast.error("Failed to delete reaction");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Reactions Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Blog</th>
              <th className="py-2 px-4 text-left">Reaction</th>
              <th className="py-2 px-4 text-left">Created At</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reactions.map((reaction) => (
              <tr key={reaction.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-2 px-4">{reaction.id}</td>
                <td className="py-2 px-4">{reaction.user?.username || "N/A"}</td>
                <td className="py-2 px-4">{reaction.blog?.title || "N/A"}</td>
                <td className="py-2 px-4 flex items-center gap-1 capitalize">
                  <span>{reactionIcons[reaction.reaction_type]}</span>
                  <span>{reaction.reaction_type}</span>
                </td>
                <td className="py-2 px-4">{new Date(reaction.created_at).toLocaleString()}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50 transition"
                    onClick={() => handleDelete(reaction.id)}
                    disabled={loadingId === reaction.id}
                  >
                    {loadingId === reaction.id ? "Deleting..." : "Delete"}
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
