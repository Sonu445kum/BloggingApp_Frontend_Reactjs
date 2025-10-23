import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetBlogQuery,
  useUpdateBlogMutation,
  useGetCategoriesQuery,
} from "../../api/apiSlice";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: blog, isLoading: isBlogLoading } = useGetBlogQuery(id);
  const { data: categories } = useGetCategoriesQuery();
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: [],
    media: [],
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        category: blog.category?.id || "",
        tags: blog.tags || [],
        media: [], // new uploads
      });
    }
  }, [blog]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagsChange = (e) => {
    setFormData({ ...formData, tags: e.target.value.split(",") });
  };

  const handleMediaChange = (e) => {
    setFormData({ ...formData, media: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (formData.category) data.append("category", formData.category);
    formData.tags.forEach((tag) => data.append("tags", tag));
    for (let i = 0; i < formData.media.length; i++) {
      data.append("media", formData.media[i]);
    }

    try {
      await updateBlog({ id, data }).unwrap();
      toast.success("Blog updated successfully!");
      navigate(`/blogs/${id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update blog");
    }
  };

  if (isBlogLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={formData.title}
          onChange={handleChange}
          className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-400"
        />

        <textarea
          name="content"
          placeholder="Blog Content"
          value={formData.content}
          onChange={handleChange}
          className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-400"
          rows={6}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select Category</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={formData.tags.join(",")}
          onChange={handleTagsChange}
          className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-400"
        />

        <input
          type="file"
          multiple
          onChange={handleMediaChange}
          className="border px-3 py-2 rounded"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          {isLoading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogEdit;
