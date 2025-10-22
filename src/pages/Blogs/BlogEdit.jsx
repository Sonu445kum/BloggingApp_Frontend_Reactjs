import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBlogsQuery, useUpdateBlogMutation } from '../../api/apiSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const BlogEdit = () => {
  const { id } = useParams();
  const { data: blogs, isLoading } = useGetBlogsQuery();
  const [updateBlog] = useUpdateBlogMutation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (blogs) {
      const blog = blogs.find((b) => b.id === parseInt(id));
      if (blog) {
        setTitle(blog.title);
        setContent(blog.content);
      }
    }
  }, [blogs, id]);

  if (isLoading) return <Loader />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBlog({ id, data: { title, content } }).unwrap();
      toast.success('Blog updated successfully');
      navigate('/blogs');
    } catch (err) {
      toast.error('Error updating blog');
    }
  };

  return (
    <div className="flex justify-center p-6">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Edit Blog</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 mb-4 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          className="w-full p-2 mb-4 border rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default BlogEdit;
