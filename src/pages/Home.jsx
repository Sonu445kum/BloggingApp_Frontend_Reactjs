import React from 'react';
import { Link } from 'react-router-dom';
import { useGetBlogsQuery } from '../api/apiSlice';
import Loader from '../components/Loader';

const Home = () => {
  const { data: blogs, isLoading, isError, error } = useGetBlogsQuery();

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p className="text-red-600">
        Error: {error?.data?.detail || 'Failed to load blogs'}
      </p>
    );

  const publishedBlogs = blogs?.filter((blog) => blog.status === 'published');

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6 font-bold">Welcome to My Blog App</h1>
      <h2 className="text-2xl mb-4 font-semibold">Latest Blogs</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {publishedBlogs && publishedBlogs.length > 0 ? (
          publishedBlogs.map((blog) => (
            <div
              key={blog.id}
              className="border p-4 rounded shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-gray-600 mb-2">
                {blog.content.slice(0, 100)}...
              </p>
              <Link
                to={`/blogs/${blog.id}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                Read More
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No blogs found</p>
        )}
      </div>
    </div>
  );
};

export default Home;
