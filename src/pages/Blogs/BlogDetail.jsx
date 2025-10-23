import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetBlogQuery,
  useAddCommentMutation,
  useToggleReactionMutation,
} from "../../api/apiSlice";
import Loader from "../../components/Loader";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: blog, isLoading, isError, refetch } = useGetBlogQuery(id);
  const [newComment, setNewComment] = useState("");
  const [addComment, { isLoading: addingComment }] = useAddCommentMutation();
  const [toggleReaction, { isLoading: reacting }] = useToggleReactionMutation();

  // Login check
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-center mt-10 text-red-500">Error fetching blog.</p>;
  if (!blog) return <p className="text-center mt-10 text-gray-600">Blog not found.</p>;

  const {
    title,
    content,
    author,
    views,
    total_reactions,
    total_comments,
    media,
    tags,
    created_at,
    comments,
  } = blog;

  // Add Comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await addComment({ blogId: id, content: newComment }).unwrap();
      toast.success("Comment added successfully!");
      setNewComment("");
      refetch();
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  // Reactions
  const handleReaction = async (reactionType) => {
    try {
      await toggleReaction({ blogId: id, reactionType }).unwrap();
      toast.success(`${reactionType} reaction updated!`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to react to blog");
    }
  };

  // Navigate to BlogCreate.jsx
  const handleNavigateToCreate = () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to create a blog!");
      navigate("/login");
      return;
    }
    navigate("/blogs/create"); // Adjust route according to your routing
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-2xl relative">
      {/* Navigate to BlogCreate Button */}
      {isLoggedIn && (
        <button
          onClick={handleNavigateToCreate}
          className="absolute top-5 right-5 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
        >
          ✍️ Create New Blog
        </button>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{title}</h1>

      {/* Author Info */}
      <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
        <span>By {author?.username || "Unknown Author"}</span>
        <span>{new Date(created_at).toLocaleDateString()}</span>
        <span>👁️ {views || 0} Views</span>
      </div>

      {/* Tags */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Media */}
      {media?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {media.map((item) => (
            <img
              key={item.id}
              src={item.file}
              alt={`Media ${item.id}`}
              className="rounded-lg object-cover w-full h-60 hover:scale-105 transition-transform duration-300"
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg mb-6 text-gray-800">{content}</div>

      {/* Reactions */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        {["like", "love", "laugh", "angry"].map((reaction) => (
          <button
            key={reaction}
            onClick={() => handleReaction(reaction)}
            disabled={reacting}
            className={`flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300 transition ${
              reacting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {reaction === "like"
              ? `👍 ${total_reactions || 0}`
              : reaction === "love"
              ? "❤️"
              : reaction === "laugh"
              ? "😂"
              : "😡"}{" "}
            {reaction.charAt(0).toUpperCase() + reaction.slice(1)}
          </button>
        ))}

        <span>💬 {total_comments || 0} Comments</span>
      </div>

      {/* Add Comment */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Add a Comment</h3>
        <textarea
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Write your comment..."
        />
        <button
          onClick={handleAddComment}
          disabled={addingComment}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {addingComment ? "Posting..." : "Post Comment"}
        </button>
      </div>

      {/* Comments */}
      {comments?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Comments</h3>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-3 bg-gray-50">
                <p className="text-gray-700">
                  <span className="font-semibold">{comment.user.username}</span>: {comment.content}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(comment.created_at).toLocaleString()}
                </p>

                {/* Replies */}
                {comment.replies?.length > 0 && (
                  <div className="ml-4 mt-2 space-y-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border-l-2 border-gray-300 pl-2">
                        <p className="text-gray-700">
                          <span className="font-semibold">{reply.user.username}</span>: {reply.content}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(reply.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
