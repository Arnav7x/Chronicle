import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../axios";
import Navbar from "../components/Navbar";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

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

        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <div className="flex justify-between text-sm text-gray-500 mb-6">
          <span>
            By <strong>{blog.author?.name}</strong>
          </span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
          {blog.content}
        </p>
      </div>
    </div>
  );
}
