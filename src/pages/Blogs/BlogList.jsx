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
// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   useGetBlogsQuery,
//   useToggleReactionMutation,
// } from "../../api/apiSlice";
// import Loader from "../../components/Loader";
// import { toast } from "react-toastify";
// import Paginations from "../../components/Paginations";
// import AddBlogModal from "./AddBlogModal";

// const BlogList = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   // 🔹 State Management
//   const [currentPage, setCurrentPage] = useState(1);
//   const [categories, setCategories] = useState(["All"]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedTag, setSelectedTag] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);

//   // 🔹 Fetch Categories
//   const fetchCategories = useCallback(async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/categories/");
//       const data = await res.json();
//       const categoryList = Array.isArray(data)
//         ? data.map((cat) => cat.name)
//         : data?.categories?.map((cat) => cat.name) || [];
//       setCategories(["All", ...categoryList]);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       toast.error("Failed to load categories");
//     }
//   }, []);

//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   // 🔹 Fetch Blogs via RTK Query
//   const {
//     data: blogsData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetBlogsQuery({
//     page: currentPage,
//     category: selectedCategory !== "All" ? selectedCategory : "",
//     search: searchQuery,
//     tag: selectedTag,
//   });

//   const [toggleReaction] = useToggleReactionMutation();

//   const blogs = blogsData?.results || [];
//   const totalCount = blogsData?.count || 0;
//   const totalPages = Math.ceil(totalCount / 10);

//   // 🔹 Pagination
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   // 🔹 Refetch blogs when filters/page changes
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     refetch();
//   }, [currentPage, selectedCategory, searchQuery, selectedTag, refetch]);

//   // 🔹 Handle Reactions
//   const handleReaction = async (blogId, reactionType) => {
//     if (!token) {
//       toast.error("Please login to react on blogs");
//       return;
//     }
//     try {
//       await toggleReaction({ blogId, reactionType }).unwrap();
//       refetch();
//     } catch (error) {
//       console.error("Reaction failed:", error);
//       toast.error("Failed to update reaction");
//     }
//   };

//   // 🔹 Loading & Error States
//   if (isLoading)
//     return (
//       <div className="flex justify-center mt-20">
//         <Loader />
//       </div>
//     );

//   if (isError)
//     return (
//       <p className="text-center text-red-600 mt-10">
//         Failed to load blogs. Please try again later.
//       </p>
//     );

//   // ============================================================
//   // 🧠 RENDER
//   // ============================================================
//   return (
//     <div className="max-w-7xl mx-auto mt-10 px-4 relative">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">📚 All Blogs</h2>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search blogs..."
//           value={searchQuery}
//           onChange={(e) => {
//             setSearchQuery(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
//         />

//         {/* Category Filter */}
//         <select
//           value={selectedCategory}
//           onChange={(e) => {
//             setSelectedCategory(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
//         >
//           {categories.map((cat, index) => (
//             <option key={index} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>

//         {/* Add Blog */}
//         {token && (
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
//           >
//             ➕ Add New Blog
//           </button>
//         )}
//       </div>

//       {/* Blog Grid */}
//       {blogs.length === 0 ? (
//         <p className="text-center text-gray-600 mt-10">No blogs found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {blogs.map((blog) => {
//             const authorName =
//               typeof blog.author === "string"
//                 ? blog.author
//                 : blog.author?.username || "Unknown";

//             const imageUrl =
//               blog.media?.length > 0
//                 ? blog.media[0].file
//                 : blog.featured_image
//                 ? blog.featured_image.startsWith("http")
//                   ? blog.featured_image
//                   : `http://127.0.0.1:8000${blog.featured_image}`
//                 : "/fallback.jpg";

//             const reactionCounts = blog.reaction_summary || {
//               like: 0,
//               love: 0,
//               laugh: 0,
//               angry: 0,
//             };

//             const userReaction = blog.user_reaction || null;

//             const reactions = [
//               { type: "like", emoji: "👍" },
//               { type: "love", emoji: "❤️" },
//               { type: "laugh", emoji: "😂" },
//               { type: "angry", emoji: "😡" },
//             ];

//             return (
//               <div
//                 key={blog.id}
//                 className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
//               >
//                 {/* Image */}
//                 <div className="relative">
//                   <img
//                     src={imageUrl}
//                     alt={blog.title || "Blog Image"}
//                     className="h-52 w-full object-cover rounded-t-xl transition-transform duration-300 hover:scale-105"
//                     loading="lazy"
//                     onError={(e) => {
//                       e.target.src = "/fallback.jpg";
//                     }}
//                   />
//                 </div>

//                 {/* Content */}
//                 <div className="p-4 flex flex-col flex-grow">
//                   <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
//                     {blog.title}
//                   </h3>
//                   <p className="text-gray-500 text-sm mb-2">
//                     ✍️ {authorName} •{" "}
//                     {blog.created_at
//                       ? new Date(blog.created_at).toLocaleDateString()
//                       : "Unknown Date"}
//                   </p>

//                   <p className="text-gray-700 text-sm flex-grow mb-3 line-clamp-3">
//                     {blog.content?.replace(/<[^>]+>/g, "").slice(0, 120)}...
//                   </p>

//                   {/* Reactions */}
//                   <div className="flex justify-between items-center text-gray-600 text-sm mb-3 flex-wrap gap-2">
//                     {reactions.map(({ type, emoji }) => (
//                       <button
//                         key={type}
//                         onClick={() => handleReaction(blog.id, type)}
//                         className={`px-2 py-1 rounded transition-all duration-200 transform flex items-center gap-1 ${
//                           userReaction === type
//                             ? "scale-110 bg-indigo-100 border border-indigo-400 shadow-sm"
//                             : "bg-gray-100 hover:bg-gray-200"
//                         }`}
//                       >
//                         <span>{emoji}</span>
//                         <span>{reactionCounts[type] || 0}</span>
//                       </button>
//                     ))}
//                     <span>💬 {blog.total_comments || 0} Comments</span>
//                   </div>

//                   {/* Read More Button */}
//                   <button
//                     onClick={() => navigate(`/blogs/${blog.id}`)}
//                     className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 w-full transition-all duration-200"
//                   >
//                     Read More
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <Paginations
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//         />
//       )}

//       {/* Add Blog Modal */}
//       {showAddModal && (
//         <AddBlogModal
//           onClose={() => {
//             setShowAddModal(false);
//             refetch();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default BlogList;


// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGetBlogsQuery, useToggleReactionMutation } from "../../api/apiSlice";
// import Loader from "../../components/Loader";
// import { toast } from "react-toastify";
// import Paginations from "../../components/Paginations";
// import AddBlogModal from "./AddBlogModal";

// const BlogList = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   // 🔹 State Management
//   const [currentPage, setCurrentPage] = useState(1);
//   const [categories, setCategories] = useState(["All"]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedTag, setSelectedTag] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);

//   // 🔹 Fetch Categories
//   const fetchCategories = useCallback(async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/categories/");
//       const data = await res.json();
//       const categoryList = Array.isArray(data)
//         ? data.map((cat) => cat.name)
//         : data?.categories?.map((cat) => cat.name) || [];
//       setCategories(["All", ...categoryList]);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       toast.error("Failed to load categories");
//     }
//   }, []);

//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   // 🔹 Fetch Blogs via RTK Query
//   const {
//     data: blogsData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetBlogsQuery({
//     page: currentPage,
//     category: selectedCategory !== "All" ? selectedCategory : "",
//     search: searchQuery,
//     tag: selectedTag,
//   });

//   const [toggleReaction] = useToggleReactionMutation();
//   const blogs = blogsData?.results || [];
//   const totalCount = blogsData?.count || 0;
//   const totalPages = Math.ceil(totalCount / 10);

//   // 🔹 Pagination
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   // 🔹 Refetch blogs when filters/page changes
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     refetch();
//   }, [currentPage, selectedCategory, searchQuery, selectedTag, refetch]);

//   // 🔹 Local Optimistic Reactions (for UI)
//   const [reactionState, setReactionState] = useState({});

//   const handleReaction = async (blogId, reactionType) => {
//     if (!token) {
//       toast.error("Please login to react on blogs");
//       return;
//     }

//     setReactionState((prev) => {
//       const current = prev[blogId] || {};
//       const prevReaction = current.userReaction;
//       const counts = { ...current.reactionCounts };

//       // Initialize if not exist
//       if (!Object.keys(counts).length) {
//         const blog = blogs.find((b) => b.id === blogId);
//         if (blog?.reaction_summary)
//           Object.assign(counts, blog.reaction_summary);
//         else
//           Object.assign(counts, { like: 0, love: 0, laugh: 0, angry: 0 });
//       }

//       // Update counts
//       if (prevReaction) counts[prevReaction]--;
//       if (prevReaction !== reactionType) counts[reactionType]++;

//       return {
//         ...prev,
//         [blogId]: {
//           userReaction: prevReaction === reactionType ? null : reactionType,
//           reactionCounts: counts,
//         },
//       };
//     });

//     try {
//       await toggleReaction({ blogId, reactionType }).unwrap();
//       refetch();
//     } catch (error) {
//       console.error("Reaction failed:", error);
//       toast.error("Failed to update reaction");
//     }
//   };

//   // 🔹 Loading & Error States
//   if (isLoading)
//     return (
//       <div className="flex justify-center mt-20">
//         <Loader />
//       </div>
//     );

//   if (isError)
//     return (
//       <p className="text-center text-red-600 mt-10">
//         Failed to load blogs. Please try again later.
//       </p>
//     );

//   // ============================================================
//   // 🧠 RENDER
//   // ============================================================
//   return (
//     <div className="max-w-7xl mx-auto mt-10 px-4 relative">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">📚 All Blogs</h2>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search blogs..."
//           value={searchQuery}
//           onChange={(e) => {
//             setSearchQuery(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
//         />

//         {/* Category Filter */}
//         <select
//           value={selectedCategory}
//           onChange={(e) => {
//             setSelectedCategory(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
//         >
//           {categories.map((cat, index) => (
//             <option key={index} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>

//         {/* Add Blog */}
//         {token && (
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
//           >
//             ➕ Add New Blog
//           </button>
//         )}
//       </div>

//       {/* Blog Grid */}
//       {blogs.length === 0 ? (
//         <p className="text-center text-gray-600 mt-10">No blogs found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {blogs.map((blog) => {
//             const authorName =
//               typeof blog.author === "string"
//                 ? blog.author
//                 : blog.author?.username || "Unknown";
//             const imageUrl =
//               blog.media?.length > 0
//                 ? blog.media[0].file
//                 : blog.featured_image
//                 ? blog.featured_image.startsWith("http")
//                   ? blog.featured_image
//                   : `http://127.0.0.1:8000${blog.featured_image}`
//                 : "/fallback.jpg";

//             const localState = reactionState[blog.id];
//             const reactionCounts =
//               localState?.reactionCounts || blog.reaction_summary || {
//                 like: 0,
//                 love: 0,
//                 laugh: 0,
//                 angry: 0,
//               };
//             const userReaction = localState?.userReaction || blog.user_reaction;

//             const reactions = [
//               { type: "like", emoji: "👍" },
//               { type: "love", emoji: "❤️" },
//               { type: "laugh", emoji: "😂" },
//               { type: "angry", emoji: "😡" },
//             ];

//             return (
//               <div
//                 key={blog.id}
//                 className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
//               >
//                 {/* Image */}
//                 <div className="relative">
//                   <img
//                     src={imageUrl}
//                     alt={blog.title || "Blog Image"}
//                     className="h-52 w-full object-cover rounded-t-xl transition-transform duration-300 hover:scale-105"
//                     loading="lazy"
//                     onError={(e) => {
//                       e.target.src = "/fallback.jpg";
//                     }}
//                   />
//                 </div>

//                 {/* Content */}
//                 <div className="p-4 flex flex-col flex-grow">
//                   <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
//                     {blog.title}
//                   </h3>
//                   <p className="text-gray-500 text-sm mb-2">
//                     ✍️ {authorName} •{" "}
//                     {blog.created_at
//                       ? new Date(blog.created_at).toLocaleDateString()
//                       : "Unknown Date"}
//                   </p>

//                   <p className="text-gray-700 text-sm flex-grow mb-3 line-clamp-3">
//                     {blog.content?.replace(/<[^>]+>/g, "").slice(0, 120)}...
//                   </p>

//                   {/* ✅ Reactions Section */}
//                   <div className="flex justify-between items-center text-gray-600 text-sm mb-3 flex-wrap gap-2">
//                     {reactions.map(({ type, emoji }) => (
//                       <button
//                         key={type}
//                         onClick={() => handleReaction(blog.id, type)}
//                         className={`px-2 py-1 rounded-full transition-all duration-200 flex items-center gap-1 border ${
//                           userReaction === type
//                             ? "bg-indigo-600 text-white border-indigo-600 scale-105"
//                             : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
//                         }`}
//                       >
//                         <span>{emoji}</span>
//                         <span>{reactionCounts[type] || 0}</span>
//                       </button>
//                     ))}
//                     <span>💬 {blog.total_comments || 0} Comments</span>
//                   </div>

//                   {/* Read More Button */}
//                   <button
//                     onClick={() => navigate(`/blogs/${blog.id}`)}
//                     className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 w-full transition-all duration-200"
//                   >
//                     Read More
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <Paginations
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//         />
//       )}

//       {/* Add Blog Modal */}
//       {showAddModal && (
//         <AddBlogModal
//           onClose={() => {
//             setShowAddModal(false);
//             refetch();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default BlogList;


// reactions updations for live show emoji count
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGetBlogsQuery, useToggleReactionMutation } from "../../api/apiSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import Paginations from "../../components/Paginations";
import AddBlogModal from "./AddBlogModal";

const BlogList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔹 State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // 🔹 Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/categories/");
      const data = await res.json();
      const categoryList = Array.isArray(data)
        ? data.map((cat) => cat.name)
        : data?.categories?.map((cat) => cat.name) || [];
      setCategories(["All", ...categoryList]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 🔹 Fetch Blogs via RTK Query
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

  const [toggleReaction] = useToggleReactionMutation();
  const blogs = blogsData?.results || [];
  const totalCount = blogsData?.count || 0;
  const totalPages = Math.ceil(totalCount / 10);

  // 🔹 Pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // 🔹 Refetch blogs when filters/page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    refetch();
  }, [currentPage, selectedCategory, searchQuery, selectedTag, refetch]);

  // =====================================================
  // ✅ Reaction State + Backend Sync
  // =====================================================
  const [reactionState, setReactionState] = useState({});

  // 🔹 Initialize reactionState whenever blogs update
  useEffect(() => {
    if (blogs.length > 0) {
      const initialReactions = {};
      blogs.forEach((blog) => {
        initialReactions[blog.id] = {
          userReaction: blog.user_reaction || null,
          reactionCounts: blog.reaction_summary || {
            like: 0,
            love: 0,
            laugh: 0,
            angry: 0,
          },
        };
      });
      setReactionState(initialReactions);
    }
  }, [blogs]);

  // 🔹 Handle Reaction Click
  const handleReaction = async (blogId, reactionType) => {
    if (!token) {
      toast.error("Please login to react on blogs");
      return;
    }

    setReactionState((prev) => {
      const current = prev[blogId] || {};
      const prevReaction = current.userReaction;
      const counts = { ...current.reactionCounts };

      // ✅ Decrease previous reaction count
      if (prevReaction) counts[prevReaction] = Math.max(0, counts[prevReaction] - 1);

      // ✅ Add new reaction if changed
      if (prevReaction !== reactionType) counts[reactionType]++;

      return {
        ...prev,
        [blogId]: {
          userReaction: prevReaction === reactionType ? null : reactionType,
          reactionCounts: counts,
        },
      };
    });

    try {
      await toggleReaction({ blogId, reactionType }).unwrap();
      refetch(); // ✅ Get latest data from backend (ensures persistence)
    } catch (error) {
      console.error("Reaction failed:", error);
      toast.error("Failed to update reaction");
    }
  };

  // =====================================================
  // 🧠 RENDER
  // =====================================================
  if (isLoading)
    return (
      <div className="flex justify-center mt-20">
        <Loader />
      </div>
    );

  if (isError)
    return (
      <p className="text-center text-red-600 mt-10">
        Failed to load blogs. Please try again later.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📚 All Blogs</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Add Blog */}
        {token && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            ➕ Add New Blog
          </button>
        )}
      </div>

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const authorName =
              typeof blog.author === "string"
                ? blog.author
                : blog.author?.username || "Unknown";

            const imageUrl =
              blog.media?.length > 0
                ? blog.media[0].file
                : blog.featured_image
                ? blog.featured_image.startsWith("http")
                  ? blog.featured_image
                  : `http://127.0.0.1:8000${blog.featured_image}`
                : "/fallback.jpg";

            const localState = reactionState[blog.id];
            const reactionCounts = localState?.reactionCounts || {
              like: 0,
              love: 0,
              laugh: 0,
              angry: 0,
            };
            const userReaction = localState?.userReaction || null;

            const reactions = [
              { type: "like", emoji: "👍" },
              { type: "love", emoji: "❤️" },
              { type: "laugh", emoji: "😂" },
              { type: "angry", emoji: "😡" },
            ];

            return (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={blog.title || "Blog Image"}
                    className="h-52 w-full object-cover rounded-t-xl transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/fallback.jpg";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    ✍️ {authorName} •{" "}
                    {blog.created_at
                      ? new Date(blog.created_at).toLocaleDateString()
                      : "Unknown Date"}
                  </p>

                  <p className="text-gray-700 text-sm flex-grow mb-3 line-clamp-3">
                    {blog.content?.replace(/<[^>]+>/g, "").slice(0, 120)}...
                  </p>

                  {/* ✅ Reactions Section */}
                  <div className="flex justify-between items-center text-gray-600 text-sm mb-3 flex-wrap gap-2">
                    {reactions.map(({ type, emoji }) => (
                      <button
                        key={type}
                        onClick={() => handleReaction(blog.id, type)}
                        className={`px-2 py-1 rounded-full transition-all duration-200 flex items-center gap-1 border ${
                          userReaction === type
                            ? "bg-indigo-600 text-white border-indigo-600 scale-105"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
                        }`}
                      >
                        <span>{emoji}</span>
                        <span>{reactionCounts[type] || 0}</span>
                      </button>
                    ))}
                    <span>💬 {blog.total_comments || 0} Comments</span>
                  </div>

                  {/* Read More Button */}
                  <button
                    onClick={() => navigate(`/blogs/${blog.id}`)}
                    className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 w-full transition-all duration-200"
                  >
                    Read More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Paginations
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Add Blog Modal */}
      {showAddModal && (
        <AddBlogModal
          onClose={() => {
            setShowAddModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default BlogList;




