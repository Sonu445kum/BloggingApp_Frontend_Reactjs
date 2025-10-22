import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateBlogMutation } from '../../api/apiSlice';
import { toast } from 'react-toastify';

const BlogCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const [createBlog] = useCreateBlogMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBlog({ title, content }).unwrap();
      toast.success('Blog created successfully');
      navigate('/blogs');
    } catch (err) {
      toast.error('Error creating blog');
    }
  };

  return (
    <div className="flex justify-center p-6">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Create Blog</h2>
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
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default BlogCreate;
