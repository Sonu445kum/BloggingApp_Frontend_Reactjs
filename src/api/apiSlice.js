// src/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ==========================
   🌐 BASE URL CONFIG
========================== */
const rawUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"; // fallback

// Ensure exactly ONE slash between base and "api"
const BASE_URL = rawUrl.replace(/\/+$/, "") + "/api";

/* ==========================
   ⚡ RTK QUERY API SLICE
========================== */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // handle cookies & CSRF if backend uses
    prepareHeaders: (headers) => {
      try {
        const token = localStorage.getItem("token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
        headers.set("Accept", "application/json");
        return headers;
      } catch (err) {
        console.error("❌ Error preparing headers:", err);
        return headers;
      }
    },
  }),
  tagTypes: [
    "Blog",
    "User",
    "Category",
    "Comment",
    "Notification",
    "Profile",
    "Stats",
  ],
  endpoints: (builder) => ({
    /* ==========================
       🔐 AUTHENTICATION ENDPOINTS
    ========================== */
    login: builder.mutation({
      query: (data) => ({
        url: "auth/login/",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "auth/register/",
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    forgotPassword: builder.mutation({
  query: (data) => ({
    url: "auth/request-password-reset/",
    method: "POST",
    body: data,
  }),
}),

verifyEmail: builder.mutation({
      query: ({ uid, token }) => ({
        url: "auth/verify-email/",
        method: "POST",
        body: { uid, token },
        headers: { "Content-Type": "application/json" },
      }),
    }),

// Optional: If you prefer GET
    verifyEmailGet: builder.query({
      query: ({ uid, token }) =>
        `auth/verify-email/?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`,
    }),
  

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "auth/reset-password/",
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "auth/change-password/",
        method: "POST",
        body: data,
      }),
    }),
    currentUser: builder.query({
      query: () => "auth/current-user/",
      providesTags: ["User"],
    }),

    /* ==========================
       🧑‍💻 PROFILE ENDPOINTS
    ========================== */
    getProfile: builder.query({
      query: () => "profile/",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "profile/update/",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    getStats: builder.query({ query: () => "stats/", providesTags: ["Stats"] }),

    /* ==========================
       📝 BLOGS CRUD ENDPOINTS
    ========================== */
    getBlogs: builder.query({ query: () => "blogs/", providesTags: ["Blog"] }),
    getBlog: builder.query({
      query: (id) => `blogs/${id}/`,
      providesTags: ["Blog"],
    }),
    createBlog: builder.mutation({
      query: (formData) => ({
        url: "blogs/create/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `blogs/${id}/update/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({ url: `blogs/${id}/delete/`, method: "DELETE" }),
      invalidatesTags: ["Blog"],
    }),
    addToBlog: builder.mutation({
      query: ({ blogId, content }) => ({
        url: `blogs/${blogId}/add-to-blog/`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Blog"],
    }),

    /* ==========================
       📸 BLOG MEDIA UPLOAD
    ========================== */
    uploadBlogMedia: builder.mutation({
      query: (formData) => ({
        url: "blogs/media/upload/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),

    /* ==========================
       🏷️ CATEGORIES
    ========================== */
    getCategories: builder.query({
      query: () => "categories/",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "categories/create/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    updateDeleteCategory: builder.mutation({
      query: ({ id, data, method }) => ({
        url: `categories/${id}/update-delete/`,
        method,
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `admin/categories/${categoryId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    /* ==========================
       😍 REACTIONS
    ========================== */
    toggleReaction: builder.mutation({
      query: ({ blogId, reactionType }) => ({
        url: `blogs/${blogId}/reactions/toggle/`,
        method: "POST",
        body: { reaction_type: reactionType },
      }),
      invalidatesTags: ["Blog"],
    }),
    getAllReactions: builder.query({ query: () => "admin/reactions/" }),
    deleteReaction: builder.mutation({
      query: (id) => ({
        url: `admin/reactions/${id}/`,
        method: "DELETE",
      }),
    }),

    /* ==========================
       💬 COMMENTS
    ========================== */
    getComments: builder.query({
      query: ({ blogId }) => `blogs/${blogId}/comments/`,
      providesTags: ["Comment"],
    }),
    addComment: builder.mutation({
      query: ({ blogId, content }) => ({
        url: `blogs/${blogId}/comments/add/`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Comment", "Blog"],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({ url: `comments/${id}/delete/`, method: "DELETE" }),
      invalidatesTags: ["Comment", "Blog"],
    }),
    approveComment: builder.mutation({
      query: (commentId) => ({
        url: `comments/${commentId}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["Comment"],
    }),

    /* ==========================
       🔔 NOTIFICATIONS
    ========================== */
    getNotifications: builder.query({
      query: () => "user/notifications/",
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}/mark-read/`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({ url: "notifications/mark-all-read/", method: "POST" }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({ url: `notifications/${id}/delete/`, method: "DELETE" }),
      invalidatesTags: ["Notification"],
    }),

    /* ==========================
       🏛️ ADMIN DASHBOARD
    ========================== */
    getDashboardStats: builder.query({
      query: () => "admin/dashboard/",
      providesTags: ["Stats"],
    }),
    getUsers: builder.query({ query: () => "admin/users/", providesTags: ["User"] }),
    getUser: builder.query({ query: (id) => `admin/users/${id}/`, providesTags: ["User"] }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `admin/users/${userId}/update-role/`,
        method: "POST",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    getAllComments: builder.query({ query: () => "admin/comments/", providesTags: ["Comment"] }),
    getAllNotifications: builder.query({ query: () => "admin/notifications/", providesTags: ["Notification"] }),
    mostActiveUsers: builder.query({ query: () => "admin/most-active-users/", providesTags: ["User"] }),
    getTrendingBlogs: builder.query({ query: () => "admin/trending-blogs/", providesTags: ["Blog"] }),
    approveBlog: builder.mutation({
      query: (blogId) => ({ url: `blogs/${blogId}/approve/`, method: "POST" }),
      invalidatesTags: ["Blog"],
    }),
    flagBlog: builder.mutation({
      query: (blogId) => ({ url: `blogs/${blogId}/flag/`, method: "POST" }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

/* ==========================
   ✅ EXPORT HOOKS
========================= */
export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useVerifyEmailGetQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useCurrentUserQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetStatsQuery,
  useGetBlogsQuery,
  useGetBlogQuery,
  useAddToBlogMutation,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUploadBlogMediaMutation,
  useToggleReactionMutation,
  useGetAllReactionsQuery,
  useDeleteReactionMutation,
  useAddCategoryMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateDeleteCategoryMutation,
  useDeleteCategoryMutation,
  useApproveCommentMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useGetAllCommentsQuery,
  useDeleteCommentMutation,
  useGetNotificationsQuery,
  useGetAllNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useGetDashboardStatsQuery,
  useMostActiveUsersQuery,
  useGetTrendingBlogsQuery,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserRoleMutation,
  useApproveBlogMutation,
  useFlagBlogMutation,
} = apiSlice;
