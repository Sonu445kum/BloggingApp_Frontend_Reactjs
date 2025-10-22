import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Dynamic BASE_URL from .env
const BASE_URL = import.meta.env.VITE_API_URL?.endsWith("/")
  ? import.meta.env.VITE_API_URL + "api/"
  : import.meta.env.VITE_API_URL + "/api/";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Blog", "User", "Category", "Comment", "Notification"],
  endpoints: (builder) => ({
    // ---------------- Auth ----------------
    login: builder.mutation({ query: (data) => ({ url: "auth/login/", method: "POST", body: data }) }),
    register: builder.mutation({ query: (data) => ({ url: "auth/register/", method: "POST", body: data }) }),
    forgotPassword: builder.mutation({ query: (data) => ({ url: "auth/request-password-reset/", method: "POST", body: data }) }),
    resetPassword: builder.mutation({ query: (data) => ({ url: "auth/reset-password/", method: "POST", body: data }) }),
    changePassword: builder.mutation({ query: (data) => ({ url: "auth/change-password/", method: "POST", body: data }) }),

    // ---------------- Blogs ----------------
    getBlogs: builder.query({ query: () => "blogs/", providesTags: ["Blog"] }),
    getBlog: builder.query({ query: (id) => `blogs/${id}/`, providesTags: ["Blog"] }),
    createBlog: builder.mutation({ query: (data) => ({ url: "blogs/create/", method: "POST", body: data }), invalidatesTags: ["Blog"] }),
    updateBlog: builder.mutation({ query: ({ id, data }) => ({ url: `blogs/${id}/update/`, method: "PUT", body: data }), invalidatesTags: ["Blog"] }),
    deleteBlog: builder.mutation({ query: (id) => ({ url: `blogs/${id}/delete/`, method: "DELETE" }), invalidatesTags: ["Blog"] }),
    approveBlog: builder.mutation({ query: (id) => ({ url: `blogs/${id}/approve/`, method: "POST" }), invalidatesTags: ["Blog"] }),
    flagBlog: builder.mutation({ query: (id) => ({ url: `blogs/${id}/flag/`, method: "POST" }), invalidatesTags: ["Blog"] }),

    // ---------------- Users ----------------
    getUsers: builder.query({ query: () => "users/", providesTags: ["User"] }),
    getUser: builder.query({ query: (id) => `users/${id}/`, providesTags: ["User"] }),

    // ---------------- Categories ----------------
    getCategories: builder.query({ query: () => "categories/", providesTags: ["Category"] }),
    createCategory: builder.mutation({ query: (data) => ({ url: "categories/create/", method: "POST", body: data }), invalidatesTags: ["Category"] }),
    updateDeleteCategory: builder.mutation({ query: ({ id, data, method }) => ({ url: `categories/${id}/update-delete/`, method, body: data }), invalidatesTags: ["Category"] }),

    // ---------------- Comments ----------------
    getComments: builder.query({ query: () => "comments/", providesTags: ["Comment"] }),
    deleteComment: builder.mutation({ query: (id) => ({ url: `comments/${id}/delete/`, method: "DELETE" }), invalidatesTags: ["Comment"] }),

    // ---------------- Notifications ----------------
    getNotifications: builder.query({ query: () => "user/notifications/", providesTags: ["Notification"] }),
    markNotificationRead: builder.mutation({ query: (id) => ({ url: `notifications/${id}/mark-read/`, method: "POST" }), invalidatesTags: ["Notification"] }),
    deleteNotification: builder.mutation({ query: (id) => ({ url: `notifications/${id}/delete/`, method: "DELETE" }), invalidatesTags: ["Notification"] }),
  }),
});

// ---------------- Export Hooks ----------------
export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useApproveBlogMutation,
  useFlagBlogMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateDeleteCategoryMutation,
  useGetCommentsQuery,
  useDeleteCommentMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} = apiSlice;
