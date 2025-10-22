import React from 'react';
import { useGetCommentsQuery } from '../../api/apiSlice';
import Loader from '../../components/Loader';

const CommentsManagement = () => {
  const { data: comments, isLoading } = useGetCommentsQuery();

  if (isLoading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6 font-bold">Comments Management</h1>
      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="border p-4 rounded shadow">
            <p className="font-semibold">{c.user.username}</p>
            <p>{c.content}</p>
            <p className="text-gray-500 text-sm">{new Date(c.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentsManagement;
