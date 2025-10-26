import React, { useState } from "react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useGetAllBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useAddToBlogMutation,
  useUploadBlogMediaMutation,
  useApproveBlogMutation,
  useFlagBlogMutation,
} from "../../api/apiSlice";

const BlogsManagement = () => {
  const { data: blogs, isLoading, refetch } = useGetAllBlogsQuery();
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [addToBlog] = useAddToBlogMutation();
  const [uploadBlogMedia] = useUploadBlogMediaMutation();
  const [approveBlog] = useApproveBlogMutation();
  const [flagBlog] = useFlagBlogMutation();

  const [loadingBlogId, setLoadingBlogId] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: [],
    media: null,
  });
  const [extraContent, setExtraContent] = useState("");

  const categoryOptions = [
    "Technology",
    "Lifestyle",
    "Business",
    "Health",
    "Education",
    "Entertainment",
    "Travel",
    "Food",
    "Finance",
    "Sports",
  ];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-xl">
        Loading blogs...
      </div>
    );

  const resetForm = () => {
    setFormData({ title: "", content: "", category: "", tags: [], media: null });
    setPreviewImage(null);
    setSelectedBlog(null);
    setExtraContent("");
  };

  // 🟢 Add Blog
  const handleAddBlog = async () => {
    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      // Create blog (without media first)
      const createdBlog = await createBlog({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      }).unwrap();

      const blogId = createdBlog.id ?? createdBlog.blog?.id;
      if (!blogId) throw new Error("Blog ID is missing from createBlog response");

      // Upload media if exists
      if (formData.media) {
        const mediaForm = new FormData();
        mediaForm.append("file", formData.media);
        mediaForm.append("blog_id", blogId);
        await uploadBlogMedia(mediaForm).unwrap();
      }

      toast.success("Blog added successfully!");
      refetch();
      resetForm();
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.error || "Failed to add blog");
    }
  };

  // ✏️ Edit Blog
  const handleEditBlog = async () => {
    if (!selectedBlog) return;

    try {
      const blogId = selectedBlog.id ?? selectedBlog.blog?.id;
      if (!blogId) throw new Error("Blog ID is missing for editing");

      // Update blog data without featured_image first
      const updateData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      };
      await updateBlog({ id: blogId, data: updateData }).unwrap();

      // Upload new media if user selected a file
      if (formData.media) {
        const mediaForm = new FormData();
        mediaForm.append("file", formData.media);
        mediaForm.append("blog_id", blogId);
        await uploadBlogMedia(mediaForm).unwrap();
      }

      toast.success("Blog updated successfully!");
      refetch();
      resetForm();
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.error || "Failed to update blog");
    }
  };

  // ➕ Add to Blog
  const handleAddToBlog = async () => {
    if (!selectedBlog || !extraContent.trim()) {
      toast.error("Please enter content to add");
      return;
    }

    try {
      await addToBlog({
        blogId: selectedBlog.id,
        content: extraContent,
      }).unwrap();
      toast.success("Added new content to blog!");
      refetch();
      resetForm();
      setActiveModal(null);
    } catch {
      toast.error("Failed to add content");
    }
  };

  // 🗑️ Delete Blog
  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id).unwrap();
      toast.success("Blog deleted successfully!");
      refetch();
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  // ✅ Approve Blog
  const handleApprove = async (blogId) => {
    try {
      setLoadingBlogId(blogId);
      await approveBlog(blogId).unwrap();
      toast.success("Blog approved successfully");
      refetch();
    } catch {
      toast.error("Failed to approve blog");
    } finally {
      setLoadingBlogId(null);
    }
  };

  // 🚩 Flag Blog
  const handleFlag = async (blogId) => {
    try {
      setLoadingBlogId(blogId);
      await flagBlog(blogId).unwrap();
      toast.success("Blog flagged successfully");
      refetch();
    } catch {
      toast.error("Failed to flag blog");
    } finally {
      setLoadingBlogId(null);
    }
  }; 

  // ✨ Modal UI
  const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ✖
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-300">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 drop-shadow-md">
        Blogs Management
      </h1>

      <div className="flex gap-4 mb-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-transform transform hover:scale-105 shadow-md"
          onClick={() => setActiveModal("add")}
        >
          ➕ Add Blog
        </button>
      </div>

      {/* Blogs Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full bg-white rounded-xl">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Author</th>
              <th className="py-3 px-6 text-left">Views</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(blogs || []).map((blog, idx) => (
              <tr
                key={blog.id}
                className={`border-b transition-colors ${
                  idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-100"
                }`}
              >
                <td className="py-3 px-6">{blog.id}</td>
                <td className="py-3 px-6 font-semibold">{blog.title}</td>
                <td className="py-3 px-6">{blog.category || "—"}</td>
                <td className="py-3 px-6">{blog.author?.username}</td>
                <td className="py-3 px-6">{blog.views ?? 0}</td>
                <td className="py-3 px-6 capitalize">{blog.status ?? "pending"}</td>
                <td className="py-3 px-6 flex flex-wrap gap-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    onClick={() => handleApprove(blog.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    onClick={() => {
                      setSelectedBlog(blog);
                      setFormData({
                        title: blog.title,
                        content: blog.content,
                        category: blog.category || "",
                        tags: blog.tags || [],
                        media: null,
                      });
                      setActiveModal("edit");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    onClick={() => handleDeleteBlog(blog.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => {
                      setSelectedBlog(blog);
                      setActiveModal("addToBlog");
                    }}
                  >
                    Add Content
                  </button>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                    onClick={() => handleFlag(blog.id)}
                  >
                    Flag
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reuse Modals for Add, Edit, AddToBlog */}
      {activeModal === "add" && (
        <BlogFormModal
          title="Add New Blog"
          formData={formData}
          setFormData={setFormData}
          categoryOptions={categoryOptions}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          onSubmit={handleAddBlog}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "edit" && selectedBlog && (
        <BlogFormModal
          title="Edit Blog"
          formData={formData}
          setFormData={setFormData}
          categoryOptions={categoryOptions}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          onSubmit={handleEditBlog}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "addToBlog" && selectedBlog && (
        <Modal title="Add Content to Blog" onClose={() => setActiveModal(null)}>
          <textarea
            value={extraContent}
            onChange={(e) => setExtraContent(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4 h-40"
            placeholder="Enter extra content"
          />
          <button
            onClick={handleAddToBlog}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded transition"
          >
            Add Content
          </button>
        </Modal>
      )}
    </div>
  );
};

// Reusable Modal Form for Add/Edit
const BlogFormModal = ({
  title,
  formData,
  setFormData,
  categoryOptions,
  previewImage,
  setPreviewImage,
  onSubmit,
  onClose,
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>

      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="border rounded w-full px-3 py-2 mb-3"
      />

      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="border rounded w-full px-3 py-2 mb-3"
      >
        <option value="">Select Category</option>
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Tags (comma separated)</label>
        <input
          type="text"
          placeholder="Enter tags separated by comma"
          value={formData.tags?.join(", ") || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              tags: e.target.value.split(",").map((t) => t.trim()),
            })
          }
          className="border rounded w-full px-3 py-2"
        />
      </div>

      <ReactQuill
        value={formData.content}
        onChange={(val) => setFormData({ ...formData, content: val })}
        className="mb-3 h-60"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setFormData({ ...formData, media: file });
          if (file) setPreviewImage(URL.createObjectURL(file));
        }}
        className="border rounded w-full px-3 py-2 mb-4"
      />

      {previewImage && (
        <img
          src={previewImage}
          alt="Preview"
          className="w-full h-40 object-cover rounded-lg mb-4 border"
        />
      )}

      <button
        onClick={onSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded transition"
      >
        {title.includes("Edit") ? "Update Blog" : "Add Blog"}
      </button>

      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        ✖
      </button>
    </div>
  </div>
);

export default BlogsManagement;
