import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const navigate = useNavigate();

  // fetch pending + approved blogs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pending = await api.get("/blogs/pending");
        setPendingBlogs(pending.data);

        const approved = await api.get("/blogs"); // only approved blogs
        setAllBlogs(approved.data);
      } catch {
        toast.error("Failed to load blogs");
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/blogs/${id}/approve`);
      toast.success("Blog approved ✅");
      setPendingBlogs(pendingBlogs.filter((b) => b._id !== id));
    } catch {
      toast.error("Error approving blog");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/blogs/${id}/reject`);
      toast.success("Blog rejected ❌");
      setPendingBlogs(pendingBlogs.filter((b) => b._id !== id));
    } catch {
      toast.error("Error rejecting blog");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Blog deleted 🗑️");
      setAllBlogs(allBlogs.filter((b) => b._id !== id));
      setPendingBlogs(pendingBlogs.filter((b) => b._id !== id));
    } catch {
      toast.error("Error deleting blog");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-orange-600 hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

        {/* Pending Blogs */}
        <h3 className="text-xl font-semibold mb-4">Pending Blogs</h3>
        {pendingBlogs.length === 0 ? (
          <p className="text-gray-500 mb-6">No pending blogs 🎉</p>
        ) : (
          <div className="space-y-6 mb-12">
            {pendingBlogs.map((blog) => (
              <div key={blog._id} className="border p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {blog.content.substring(0, 150)}...
                </p>
                <p className="text-sm mb-2">
                  Submitted by <strong>{blog.author?.name}</strong> (
                  {blog.author?.email})
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApprove(blog._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(blog._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Approved Blogs */}
        <h3 className="text-xl font-semibold mb-4">Approved Blogs</h3>
        {allBlogs.length === 0 ? (
          <p className="text-gray-500">No approved blogs yet.</p>
        ) : (
          <div className="space-y-6">
            {allBlogs.map((blog) => (
              <div key={blog._id} className="border p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {blog.content.substring(0, 150)}...
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span>
                    By <strong>{blog.author?.name}</strong>
                  </span>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
