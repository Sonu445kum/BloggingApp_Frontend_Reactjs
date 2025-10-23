import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateBlogMutation, useUploadBlogMediaMutation } from "../../api/apiSlice";

const BlogCreate = () => {
  const navigate = useNavigate();
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [uploadMedia] = useUploadBlogMediaMutation();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    status: "draft",
  });

  const [file, setFile] = useState(null);

  // Handle text fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit Blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to create a blog");
        return;
      }

      // 1️ Create blog first
      const response = await createBlog(formData).unwrap();
      const blogId = response?.id || response?.data?.id;

      toast.success(" Blog created successfully!");

      // 2️ Upload image if file selected
      if (file && blogId) {
        const imageData = new FormData();
        imageData.append("blog_id", blogId);
        imageData.append("file", file);

        await uploadMedia(imageData).unwrap();
        toast.success("📸 Image uploaded successfully!");
      }

      // 3️ Redirect to blog list
      navigate("/blogs");
    } catch (err) {
      console.error("Error:", err);
      toast.error(
        err?.data?.errors
          ? JSON.stringify(err.data.errors)
          : err?.data?.message
          ? err.data.message
          : "Failed to create blog"
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white shadow-lg p-8 rounded-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        ✍️ Create a New Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter your blog title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea
            name="content"
            placeholder="Write your blog content..."
            rows="6"
            value={formData.content}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 mb-2">Category</label>
          <input
            type="text"
            name="category"
            placeholder="Enter category name"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
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
          disabled={isLoading}
          className={`w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all ${
            isLoading && "opacity-60 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogCreate;
