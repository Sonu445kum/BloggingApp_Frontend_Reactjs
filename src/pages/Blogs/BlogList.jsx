// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   useGetBlogsQuery,
//   useDeleteBlogMutation,
//   useToggleReactionMutation,
//   useAddToBlogMutation,
// } from "../../api/apiSlice";
// import Loader from "../../components/Loader";
// import { toast } from "react-toastify";

// const BlogList = () => {
//   const navigate = useNavigate();

//   // ✅ Fetch blogs
//   const {
//     data: blogsData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetBlogsQuery();

//   // ✅ Mutations
//   const [deleteBlog, { isLoading: deleting }] = useDeleteBlogMutation();
//   const [toggleReaction] = useToggleReactionMutation();
//   const [addToBlog] = useAddToBlogMutation();

//   // ✅ Auth info
//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("role");

//   // ✅ Loading & error states
//   if (isLoading) return <Loader />;
//   if (isError) return <p className="text-center text-red-500 mt-10">Failed to load blogs.</p>;

//   // ✅ Normalize blogs data
//   const blogs = Array.isArray(blogsData)
//     ? blogsData
//     : blogsData?.results || [];

//   // ✅ Handle delete
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this blog?")) {
//       try {
//         await deleteBlog(id).unwrap();
//         toast.success("Blog deleted successfully!");
//         refetch();
//       } catch (err) {
//         toast.error(err?.data?.message || "Failed to delete blog");
//       }
//     }
//   };

//   // ✅ Handle reactions (like/love/laugh/angry)
//   const handleReaction = async (blogId, reactionType) => {
//     try {
//       await toggleReaction({ blogId, reactionType }).unwrap();
//       toast.success(`You reacted with ${reactionType}!`);
//       refetch();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update reaction");
//     }
//   };

//   // ✅ Handle AddToBlog
//   const handleAddToBlog = async (blogId) => {
//     try {
//       const response = await addToBlog(blogId).unwrap();
//       toast.success("📝 New blog created successfully!");
//       navigate(`/blogs/edit/${response.id}`);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add blog");
//     }
//   };

//   // ✅ Empty state
//   if (!blogs || blogs.length === 0)
//     return <p className="text-center mt-10 text-gray-600">No blogs found.</p>;

//   return (
//     <div className="max-w-7xl mx-auto mt-10 px-4">
//       {/* 🔹 Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">📚 All Blogs</h2>
//         {token && (userRole === "Admin" || userRole === "Editor") && (
//           <button
//             onClick={() => navigate("/blogs/create")}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             ➕ Add New Blog
//           </button>
//         )}
//       </div>

//       {/* 🔹 Blog Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {blogs.map((blog) => {
//           const authorName =
//             typeof blog.author === "string"
//               ? blog.author
//               : blog.author?.username || "Unknown";

//           return (
//             <div
//               key={blog.id}
//               className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
//             >
//               {/* 🖼️ Blog Image */}
//               {blog.media?.length > 0 ? (
//                 <img
//                   src={blog.media[0].file || blog.media[0]}
//                   alt={blog.title}
//                   className="h-52 w-full object-cover rounded-t-xl"
//                 />
//               ) : (
//                 <img
//                   src="https://via.placeholder.com/400x200"
//                   alt={blog.title}
//                   className="h-52 w-full object-cover rounded-t-xl"
//                 />
//               )}

//               {/* 📄 Blog Info */}
//               <div className="p-4 flex flex-col flex-grow">
//                 <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
//                   {blog.title}
//                 </h3>
//                 <p className="text-gray-500 text-sm mb-2">
//                   ✍️ By {authorName} •{" "}
//                   {blog.created_at
//                     ? new Date(blog.created_at).toLocaleDateString()
//                     : "Unknown Date"}
//                 </p>

//                 <p className="text-gray-700 text-sm flex-grow mb-3 line-clamp-3">
//                   {blog.content?.length > 120
//                     ? blog.content.slice(0, 120) + "..."
//                     : blog.content}
//                 </p>

//                 {/* 🏷️ Tags */}
//                 <div className="flex flex-wrap gap-1 mb-3">
//                   {blog.tags?.map((tag, index) => (
//                     <span
//                       key={index}
//                       className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
//                     >
//                       #{tag}
//                     </span>
//                   ))}
//                 </div>

//                 {/* 💬 Reactions */}
//                 <div className="flex justify-between items-center text-gray-600 text-sm mb-3 flex-wrap gap-2">
//                   {[
//                     { type: "like", emoji: "👍 Like" },
//                     { type: "love", emoji: "❤️ Love" },
//                     { type: "laugh", emoji: "😂 Laugh" },
//                     { type: "angry", emoji: "😡 Angry" },
//                   ].map(({ type, emoji }) => (
//                     <button
//                       key={type}
//                       onClick={() => handleReaction(blog.id, type)}
//                       className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition"
//                     >
//                       {emoji}
//                     </button>
//                   ))}
//                   <span>💬 {blog.total_comments || 0} Comments</span>
//                 </div>

//                 {/* 🔘 Actions */}
//                 <div className="flex flex-wrap gap-2 mt-auto">
//                   <button
//                     onClick={() => navigate(`/blogs/${blog.id}`)}
//                     className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex-1"
//                   >
//                     Read More
//                   </button>

//                   {token && (userRole === "Admin" || userRole === "Editor") && (
//                     <>
//                       <button
//                         onClick={() => navigate(`/blogs/edit/${blog.id}`)}
//                         className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex-1"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(blog.id)}
//                         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex-1"
//                       >
//                         {deleting ? "Deleting..." : "Delete"}
//                       </button>
//                       <button
//                         onClick={() => handleAddToBlog(blog.id)}
//                         className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 flex-1"
//                       >
//                         AddToBlog
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default BlogList;


// new Blogs List
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useToggleReactionMutation,
  useAddToBlogMutation,
} from "../../api/apiSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import Paginations from "../../components/Paginations";

const BlogList = () => {
  const navigate = useNavigate();

  // ✅ States
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // ✅ Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/categories/");
        const data = await res.json();
        const categoryList = data?.categories?.map((cat) => cat.name) || [];
        setCategories(["All", ...categoryList]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // ✅ User info
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user?.username || "";

  // ✅ Fetch blogs with filters
  const {
    data: blogsData,
    isLoading,
    isError,
    refetch,
  } = useGetBlogsQuery({
    page: currentPage,
    category: selectedCategory !== "All" ? selectedCategory : "",
    search: searchQuery,
    tag: selectedTag,
  });

  // ✅ Mutations
  const [deleteBlog, { isLoading: deleting }] = useDeleteBlogMutation();
  const [toggleReaction] = useToggleReactionMutation();
  const [addToBlog] = useAddToBlogMutation();

  // ✅ Normalize Data
  const blogs = blogsData?.results || [];
  const totalCount = blogsData?.count || 0;
  const totalPages = Math.ceil(totalCount / 10);

  // ✅ Pagination
  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ Refetch on filter/search change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    refetch();
  }, [currentPage, selectedCategory, searchQuery, selectedTag]);

  // ✅ Delete Blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id).unwrap();
      toast.success("🗑️ Blog deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete blog");
    }
  };

  // ✅ Reaction Handler
  const handleReaction = async (blogId, reactionType) => {
    try {
      await toggleReaction({ blogId, reactionType }).unwrap();
      toast.success(`You reacted with ${reactionType}!`);
      refetch();
    } catch {
      toast.error("Failed to update reaction");
    }
  };

  // ✅ Add Blog
  const handleAddToBlog = async () => {
    try {
      const response = await addToBlog().unwrap();
      toast.success("📝 New blog created successfully!");
      navigate(`/blogs/edit/${response.id}`);
    } catch {
      toast.error("Failed to add blog");
    }
  };

  // ✅ Loading & Error
  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">
        ❌ Failed to load blogs.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      {/* 🔹 Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📚 All Blogs</h2>

        {/* 🔹 Search Input */}
        <input
          type="text"
          placeholder="🔍 Search blogs..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
        />

        {/* 🔹 Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))
          ) : (
            <option>Loading...</option>
          )}
        </select>

        {/* 🔹 Add Blog Button */}
        {token && (
          <button
            onClick={handleAddToBlog}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            ➕ Add New Blog
          </button>
        )}
      </div>

      {/* 🔹 Blog Cards */}
      {blogs.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          No blogs found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const authorName =
              typeof blog.author === "string"
                ? blog.author
                : blog.author?.username || "Unknown";
            const isOwner = authorName === username;

            return (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* 🖼️ Blog Image */}
                <img
                  src={
                    blog.media?.[0]?.file ||
                    blog.media?.[0] ||
                    blog.featured_image ||
                    "https://via.placeholder.com/400x200"
                  }
                  alt={blog.title}
                  className="h-52 w-full object-cover rounded-t-xl"
                />

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    ✍️ By {authorName} •{" "}
                    {blog.created_at
                      ? new Date(blog.created_at).toLocaleDateString()
                      : "Unknown Date"}
                  </p>

                  <p className="text-gray-700 text-sm flex-grow mb-3 line-clamp-3">
                    {blog.content?.length > 120
                      ? blog.content.slice(0, 120) + "..."
                      : blog.content}
                  </p>

                  {/* 💬 Reactions */}
                  <div className="flex justify-between items-center text-gray-600 text-sm mb-3 flex-wrap gap-2">
                    {[{ type: "like", emoji: "👍 Like" },
                      { type: "love", emoji: "❤️ Love" },
                      { type: "laugh", emoji: "😂 Laugh" },
                      { type: "angry", emoji: "😡 Angry" },
                    ].map(({ type, emoji }) => (
                      <button
                        key={type}
                        onClick={() => handleReaction(blog.id, type)}
                        className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition"
                      >
                        {emoji}
                      </button>
                    ))}
                    <span>💬 {blog.total_comments || 0} Comments</span>
                  </div>

                  {/* 🧭 Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <button
                      onClick={() => navigate(`/blogs/${blog.id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex-1"
                    >
                      Read More
                    </button>

                    {token && isOwner && (
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <Paginations
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default BlogList;







