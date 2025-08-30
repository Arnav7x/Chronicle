import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../axios";
import Navbar from "../components/Navbar";
import { FaEye, FaThumbsUp } from "react-icons/fa";
import DOMPurify from "dompurify";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [hasLiked, setHasLiked] = useState(false);

  const currentUser = localStorage.getItem("userId"); // mock current user
  const hasIncrementedRef = useRef(false);

  // Fetch blog details
  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);
      setBlog(res.data);
      setLikes(res.data.likes || 0);
      setComments(res.data.comments || []);
      if (res.data.likedBy?.includes(currentUser)) {
        setHasLiked(true);
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
    }
  };

  // Increment views once per page load
  useEffect(() => {
    if (!id) return;

    const incrementViews = async () => {
      try {
        if (!hasIncrementedRef.current) {
          const res = await api.put(`/blogs/${id}/views`);
          setBlog((prev) => ({ ...prev, views: res.data.views }));
          hasIncrementedRef.current = true;
        }
      } catch (err) {
        console.error("Error incrementing views:", err);
      }
    };

    fetchBlog().then(incrementViews);
  }, [id]);

  // Like / Unlike
  const handleLike = async () => {
    try {
      const res = await api.put(`/blogs/${id}/like`, { userId: currentUser });
      setLikes(res.data.likes);
      setHasLiked(res.data.hasLiked);
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  // Add comment
  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/blogs/${id}/comment`, {
        text: newComment,
        userId: currentUser,
      });

      // Update UI immediately
      setComments(res.data.comments);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-800">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="text-orange-600 hover:underline mb-4 inline-block"
        >
          ← Back to Home
        </Link>

        {/* Title + Views */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">{blog.title}</h1>
          <div className="flex items-center gap-1 text-gray-600">
            <FaEye className="text-lg" />
            <span>{blog.views || 0}</span>
          </div>
        </div>

        {/* Author + Date */}
        <div className="flex justify-between text-sm text-gray-500 mb-6">
          <span>
            By <strong>{blog.author?.name || "Unknown"}</strong>
          </span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        {/* ✅ Render formatted blog content */}
        <div
          className="prose max-w-none text-lg leading-relaxed text-gray-700"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(blog.content),
          }}
        />

        {/* Like Button */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition ${
              hasLiked
                ? "bg-blue-700 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <FaThumbsUp /> {hasLiked ? "Liked" : "Like"} ({likes})
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-12 bg-gray-50 border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>

          {/* Input + Button */}
          <div className="flex items-center mb-5">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleComment}
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
            >
              Post
            </button>
          </div>

          {/* Display Comments */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet. Be the first!</p>
            ) : (
              comments.map((c, i) => (
                <div
                  key={i}
                  className="p-4 bg-white border rounded-lg shadow-sm"
                >
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>{c.user?.name || "Anonymous"}</strong>{" "}
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-gray-800">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
