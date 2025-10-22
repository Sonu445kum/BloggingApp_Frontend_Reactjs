import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetBlogsQuery } from '../../api/apiSlice';
import Loader from '../../components/Loader';

const BlogDetail = () => {
  const { id } = useParams();
  const { data: blogs, isLoading } = useGetBlogsQuery();

  if (isLoading) return <Loader />;

  const blog = blogs.find((b) => b.id === parseInt(id));

  if (!blog) return <p>Blog not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4 font-bold">{blog.title}</h1>
      <p className="text-gray-700">{blog.content}</p>
    </div>
  );
};

export default BlogDetail;
