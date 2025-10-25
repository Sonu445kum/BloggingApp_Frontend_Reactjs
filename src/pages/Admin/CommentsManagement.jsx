// src/pages/Admin/CommentsManagement.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetAllCommentsQuery,
  useDeleteCommentMutation,
  useApproveCommentMutation,
} from "../../api/apiSlice";

const CommentsManagement = () => {
  const { data: comments, isLoading, refetch } = useGetAllCommentsQuery();
  const [deleteComment] = useDeleteCommentMutation();
  const [approveComment] = useApproveCommentMutation();
  const [loadingId, setLoadingId] = useState(null);

  if (isLoading) return <p>Loading comments...</p>;

  const handleDelete = async (id) => {
    try {
      setLoadingId(id);
      await deleteComment(id).unwrap();
      toast.success("Comment deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setLoadingId(null);
    }
  };

  const handleApprove = async (id) => {
    try {
      setLoadingId(id);
      await approveComment(id).unwrap();
      toast.success("Comment approved successfully");
      refetch();
    } catch {
      toast.error("Failed to approve comment");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Comments Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Blog</th>
              <th className="py-2 px-4 text-left">Comment</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{comment.id}</td>
                <td className="py-2 px-4">{comment.user.username}</td>
                <td className="py-2 px-4">{comment.blog.title}</td>
                <td className="py-2 px-4">{comment.content}</td>
                <td className="py-2 px-4">{comment.status}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    onClick={() => handleApprove(comment.id)}
                    disabled={loadingId === comment.id || comment.status === "approved"}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    onClick={() => handleDelete(comment.id)}
                    disabled={loadingId === comment.id}
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

export default CommentsManagement;
