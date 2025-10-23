import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useToggleReactionMutation,
  useAddToBlogMutation,
} from "../../api/apiSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const BlogList = () => {
  const navigate = useNavigate();
  const { data: blogs, isLoading, refetch } = useGetBlogsQuery();
  const [deleteBlog, { isLoading: deleting }] = useDeleteBlogMutation();
  const [toggleReaction] = useToggleReactionMutation();
  const [addToBlog] = useAddToBlogMutation();

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (isLoading) return <Loader />;

  // 🗑️ Delete Blog
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id).unwrap();
        toast.success("Blog deleted successfully!");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete blog");
      }
    }
  };

  // 😍 React to Blog
  const handleReaction = async (blogId, reactionType) => {
    try {
      await toggleReaction({ blogId, reactionType }).unwrap();
      toast.success(`You reacted with ${reactionType}!`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update reaction");
    }
  };

  // ➕ Add To Blog
  const handleAddToBlog = async (blogId) => {
    try {
      await addToBlog(blogId).unwrap();
      toast.success("Added to your blog successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to blog");
    }
  };

  if (!blogs || blogs.length === 0)
    return <p className="text-center mt-10 text-gray-600">No blogs found.</p>;

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Blogs</h2>
        {token && (userRole === "Admin" || userRole === "Editor") && (
          <button
            onClick={() => navigate("/blogs/create")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Blog
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => {
          const authorName =
            typeof blog.author === "string"
              ? blog.author
              : blog.author?.username || "Unknown";

          return (
            <div
              key={blog.id}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            >
              {/* 🖼️ Blog Image */}
              {blog.media?.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto h-48">
                  {blog.media.map((item, index) => (
                    <img
                      key={item.id || index}
                      src={item.file || item}
                      alt={blog.title}
                      className="h-48 w-auto object-cover rounded"
                    />
                  ))}
                </div>
              ) : (
                <img
                  src="https://via.placeholder.com/400x200"
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
              )}

              {/* 📝 Blog Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-1">{blog.title}</h3>
                <p className="text-gray-400 text-sm mb-2">
                  By {authorName} |{" "}
                  {blog.created_at
                    ? new Date(blog.created_at).toLocaleDateString()
                    : "Unknown Date"}
                </p>
                <p className="text-gray-700 flex-grow">
                  {blog.content.length > 100
                    ? blog.content.slice(0, 100) + "..."
                    : blog.content}
                </p>

                {/* 🏷️ Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {blog.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 💬 Reaction Buttons */}
                <div className="flex justify-between mt-3 text-gray-600 text-sm gap-2 flex-wrap">
                  {["like", "love", "laugh", "angry"].map((reaction) => (
                    <button
                      key={reaction}
                      onClick={() => handleReaction(blog.id, reaction)}
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition"
                    >
                      {reaction === "like"
                        ? `👍 ${blog.total_reactions || 0}`
                        : reaction === "love"
                        ? "❤️ Love"
                        : reaction === "laugh"
                        ? "😂 Laugh"
                        : "😡 Angry"}
                    </button>
                  ))}
                  <span>💬 {blog.total_comments || 0} Comments</span>
                </div>

                {/* 🧭 Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/blogs/${blog.id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex-1"
                  >
                    Read More
                  </button>

                  {token && (userRole === "Admin" || userRole === "Editor") && (
                    <>
                      <button
                        onClick={() => navigate(`/blogs/edit/${blog.id}`)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex-1"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex-1"
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </button>

                      <button
                        onClick={() => handleAddToBlog(blog.id)}
                        className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 flex-1"
                      >
                        AddToBlog
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogList;
