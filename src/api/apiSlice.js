// src/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 🌍 Base URL setup from .env
const BASE_URL = import.meta.env.VITE_API_URL?.endsWith("/")
  ? `${import.meta.env.VITE_API_URL}api/`
  : `${import.meta.env.VITE_API_URL}/api/`;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", //  handles cookies/CSRF if backend uses them
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
    "Bookmark",
    "Profile",
    "Stats",
  ],
  endpoints: (builder) => ({
    /* ==========================
       🔐 AUTHENTICATION
    ========================== */
    login: builder.mutation({
      query: (data) => ({ url: "auth/login/", method: "POST", body: data }),
    }),
    register: builder.mutation({
      query: (data) => ({ url: "auth/register/", method: "POST", body: data }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "auth/request-password-reset/",
        method: "POST",
        body: data,
      }),
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
       🧑‍💻 PROFILE
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
       📝 BLOGS CRUD
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
       👑 ADMIN PANEL
    ========================== */
    getUsers: builder.query({
      query: () => "admin/users/",
      providesTags: ["User"],
    }),
    getUser: builder.query({
      query: (id) => `admin/users/${id}/`,
      providesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `admin/users/${userId}/update-role/`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    mostActiveUsers: builder.query({
      query: () => "admin/most-active-users/",
      providesTags: ["User"],
    }),
    trendingBlogsAdmin: builder.query({
      query: () => "admin/trending-blogs/",
      providesTags: ["Blog"],
    }),
  }),
});

/* ==========================
   ✅ EXPORT HOOKS
========================= */
export const {
  useLoginMutation,
  useRegisterMutation,
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
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateDeleteCategoryMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserRoleMutation,
  useMostActiveUsersQuery,
  useTrendingBlogsAdminQuery,
} = apiSlice;
