import React from 'react';
import { Link } from 'react-router-dom';
import { useGetBlogsQuery, useDeleteBlogMutation } from '../../api/apiSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const BlogList = () => {
  const { data: blogs, isLoading } = useGetBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();

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
      <h1 className="text-3xl mb-6 font-bold">All Blogs</h1>
      <Link
        to="/blogs/create"
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Create New Blog
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-2">{blog.content.slice(0, 100)}...</p>
              <div className="flex gap-2">
                <Link
                  to={`/blogs/edit/${blog.id}`}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
                <Link
                  to={`/blogs/${blog.id}`}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  View
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs found</p>
        )}
      </div>
    </div>
  );
};

export default BlogList;
