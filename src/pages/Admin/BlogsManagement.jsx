import React from 'react';
import { useGetBlogsQuery, useUpdateBlogMutation, useDeleteBlogMutation } from '../../api/apiSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const BlogsManagement = () => {
  const { data: blogs, isLoading } = useGetBlogsQuery();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const handleApprove = async (blog) => {
    try {
      await updateBlog({ id: blog.id, data: { status: 'published' } }).unwrap();
      toast.success('Blog approved!');
    } catch (err) {
      toast.error('Error approving blog');
    }
  };

  const handleFlag = async (blog) => {
    try {
      await updateBlog({ id: blog.id, data: { status: 'flagged' } }).unwrap();
      toast.success('Blog flagged!');
    } catch (err) {
      toast.error('Error flagging blog');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id).unwrap();
        toast.success('Blog deleted successfully');
      } catch (err) {
        toast.error('Error deleting blog');
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6 font-bold">Blogs Management</h1>
      <ul className="space-y-4">
        {blogs.map((b) => (
          <li key={b.id} className="border p-4 rounded shadow flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{b.title}</h2>
              <p className="text-gray-500">{b.status}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(b)}
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleFlag(b)}
                className="bg-yellow-600 text-white px-2 py-1 rounded"
              >
                Flag
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogsManagement;
