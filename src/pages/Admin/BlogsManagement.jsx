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

  if (isLoading) return <p>Loading blogs...</p>;

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
    <div>
      <h1 className="text-2xl font-bold mb-4">Blogs Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Author</th>
              <th className="py-2 px-4 text-left">Views</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{blog.id}</td>
                <td className="py-2 px-4">{blog.title}</td>
                <td className="py-2 px-4">{blog.author.username}</td>
                <td className="py-2 px-4">{blog.views}</td>
                <td className="py-2 px-4">{blog.status}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    onClick={() => handleApprove(blog.id)}
                    disabled={loadingBlogId === blog.id || blog.status === "published"}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    onClick={() => handleFlag(blog.id)}
                    disabled={loadingBlogId === blog.id || blog.is_flagged}
                  >
                    Flag
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
