import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetBlogQuery,
  useUpdateBlogMutation,
} from "../../api/apiSlice";
import Loader from "../../components/Loader";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch blog by ID
  const { data: blog, isLoading, isError, refetch } = useGetBlogQuery(id);
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    if (blog) {
      // Only allow current user to edit
      if (blog.author?.id !== parseInt(localStorage.getItem("userId"))) {
        toast.error("You can only edit your own blog!");
        navigate("/");
        return;
      }

      setTitle(blog.title);
      setContent(blog.content);
      setCategory(blog.category || "");
    }
  }, [blog, navigate]);

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-center mt-10 text-red-500">Error loading blog.</p>;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and Content are required!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (category) formData.append("category", category);
      if (file) formData.append("file", file);

      await updateBlog({ id, data: formData }).unwrap();

      toast.success("Blog updated successfully!");
      refetch();
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error("Error updating blog:", err);
      toast.error(
        err?.data?.errors || err?.data?.message || "Failed to update blog"
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white shadow-lg p-8 rounded-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        ✏️ Edit Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Write your blog content..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 mb-2">Category (optional)</label>
          <input
            type="number"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category ID"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 mb-2">Upload Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg p-2 cursor-pointer"
          />
          {file && (
            <p className="text-sm text-gray-500 mt-1">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={updating}
          className={`w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition ${
            updating ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {updating ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogEdit;
