// src/pages/Admin/BlogsManagement.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetTrendingBlogsQuery,
  useApproveBlogMutation,
  useFlagBlogMutation,
} from "../../api/apiSlice";

const BlogsManagement = () => {
  const { data: blogs, isLoading, refetch } = useGetTrendingBlogsQuery();
  const [approveBlog] = useApproveBlogMutation();
  const [flagBlog] = useFlagBlogMutation();
  const [loadingBlogId, setLoadingBlogId] = useState(null);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-xl">
        Loading blogs...
      </div>
    );

  const handleApprove = async (blogId) => {
    try {
      setLoadingBlogId(blogId);
      await approveBlog(blogId).unwrap();
      toast.success("Blog approved successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to approve blog");
    } finally {
      setLoadingBlogId(null);
    }
  };

  const handleFlag = async (blogId) => {
    try {
      setLoadingBlogId(blogId);
      await flagBlog(blogId).unwrap();
      toast.success("Blog flagged successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to flag blog");
    } finally {
      setLoadingBlogId(null);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-100 to-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Blogs Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Author</th>
              <th className="py-3 px-6 text-left">Views</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(blogs || []).map((blog) => (
              <tr
                key={blog.id}
                className="border-b hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 font-medium text-gray-700">{blog.id}</td>
                <td className="py-3 px-6 font-medium text-gray-800">
                  {blog.title ?? "Untitled"}
                </td>
                <td className="py-3 px-6 text-gray-600">
                  {blog.author?.username ?? "Unknown"}
                </td>
                <td className="py-3 px-6 text-gray-600">{blog.views ?? 0}</td>
                <td className="py-3 px-6 font-medium text-gray-700">
                  {blog.status ?? "pending"}
                </td>
                <td className="py-3 px-6 flex gap-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => handleApprove(blog.id)}
                    disabled={loadingBlogId === blog.id || blog.status === "published"}
                  >
                    {loadingBlogId === blog.id && blog.status !== "published"
                      ? "Processing..."
                      : "Approve"}
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => handleFlag(blog.id)}
                    disabled={loadingBlogId === blog.id || blog.is_flagged}
                  >
                    {loadingBlogId === blog.id && blog.is_flagged !== true
                      ? "Processing..."
                      : "Flag"}
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

export default BlogsManagement;
