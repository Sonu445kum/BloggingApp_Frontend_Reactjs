import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//  Dynamic BASE_URL setup
const BASE_URL = import.meta.env.VITE_API_URL?.endsWith("/")
  ? `${import.meta.env.VITE_API_URL}api/`
  : `${import.meta.env.VITE_API_URL}/api/`;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "Blog",
    "User",
    "Category",
    "Comment",
    "Notification",
    "Bookmark",
  ],

  endpoints: (builder) => ({
    // ---------------- AUTH ----------------
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
      }),
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

    // ---------------- BLOGS ----------------
    getBlogs: builder.query({
      query: () => "blogs/",
      providesTags: ["Blog"],
    }),
    getBlog: builder.query({
      query: (id) => `blogs/${id}/`,
      providesTags: ["Blog"],
    }),
    createBlog: builder.mutation({
      query: (data) => ({
        url: "blogs/create/",
        method: "POST",
        body: data,
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
      query: (id) => ({
        url: `blogs/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
    approveBlog: builder.mutation({
      query: (id) => ({
        url: `blogs/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["Blog"],
    }),
    flagBlog: builder.mutation({
      query: (id) => ({
        url: `blogs/${id}/flag/`,
        method: "POST",
      }),
      invalidatesTags: ["Blog"],
    }),
    uploadBlogMedia: builder.mutation({
      query: (formData) => ({
        url: "blogs/media/upload/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),
     //  ADD TO BLOG (Re-added)
    //  AddToBlog (creates new blog from existing one)
    addToBlog: builder.mutation({
      query: (blogId) => ({
        url: `blogs/${blogId}/add-to-blog/`,
        method: "POST",
      }),
      invalidatesTags: ["Blog"],
    }),

    // ---------------- CATEGORIES ----------------
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

    // ---------------- COMMENTS ----------------
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
      query: (id) => ({
        url: `comments/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment", "Blog"],
    }),

    // ---------------- REACTIONS ----------------
    toggleReaction: builder.mutation({
      query: ({ blogId, reactionType }) => ({
        url: `blogs/${blogId}/reactions/toggle/`,
        method: "POST",
        body: { reaction_type: reactionType },
      }),
      invalidatesTags: ["Blog"],
    }),

    // ---------------- BOOKMARKS ----------------
    toggleBookmark: builder.mutation({
      query: ({ blogId }) => ({
        url: `blogs/${blogId}/bookmark/`,
        method: "POST",
      }),
      invalidatesTags: ["Bookmark", "Blog"],
    }),
    getUserBookmarks: builder.query({
      query: () => "user/bookmarks/",
      providesTags: ["Bookmark"],
    }),

    // ---------------- NOTIFICATIONS ----------------
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
      query: () => ({
        url: "notifications/mark-all-read/",
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    // ---------------- ADMIN ----------------
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

// ---------------- EXPORT HOOKS ----------------
export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useCurrentUserQuery,

  // Blogs
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useApproveBlogMutation,
  useFlagBlogMutation,
  useUploadBlogMediaMutation,
  useAddToBlogMutation,

  // Categories
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateDeleteCategoryMutation,

  // Comments
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,

  // Reactions
  useToggleReactionMutation,

  // Bookmarks
  useToggleBookmarkMutation,
  useGetUserBookmarksQuery,

  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,

  // Admin
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserRoleMutation,
  useMostActiveUsersQuery,
  useTrendingBlogsAdminQuery,
} = apiSlice;
