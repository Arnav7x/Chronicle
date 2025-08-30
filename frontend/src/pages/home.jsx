<<<<<<< Updated upstream
import React, { useContext, useEffect, useState } from "react";
=======
import React, { useContext, useState } from "react";
>>>>>>> Stashed changes
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../axios";

export default function HomePage() {
  const { user, logout } = useContext(AuthContext);
<<<<<<< Updated upstream
  const [blogs, setBlogs] = useState([]);
=======
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
>>>>>>> Stashed changes

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  // ✅ fetch approved blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-800">
      {/* ✅ Navbar (no Create Post button here) */}
      <header className="flex justify-between items-center px-8 py-4 border-b">
        <Link to="/" className="text-xl font-bold text-orange-600">
          Chronicle
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="text-neutral-700 hover:underline">
            Home
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 text-neutral-700 hover:bg-gray-100 px-3 py-2 rounded-md transition"
              >
                <span>Hi, {user.name}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-neutral-700"
                  >
                    Logout
                  </button>
                  <button
                    
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-neutral-700"
                  >
                    Settings
                  </button>
                  
                  
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ✅ Create Post button now in the body */}
      {user && (
        <div className="px-8 py-6 max-w-6xl mx-auto flex justify-end">
          <Link
            to="/create"
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md"
          >
            Create Post
          </Link>
        </div>
      )}

      {/* ✅ Homepage hero */}
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold mb-4">Chronicle</h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Thoughtful articles on design, development, and digital experiences.<br />
          Discover insights that matter.
        </p>
      </section>

      {/* ✅ Show approved blogs from DB */}
      <section className="px-8 max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold mb-6">Latest Articles</h3>

        {blogs.length === 0 ? (
          <p className="text-neutral-500">No blogs published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="shadow-sm border rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-2">{blog.title}</h4>
                <p className="text-sm text-neutral-600 mb-4">
                  {blog.content.length > 120
                    ? blog.content.substring(0, 120) + "..."
                    : blog.content}
                </p>
                <div className="text-sm text-neutral-500 flex justify-between items-center">
                  <span>
                    <strong className="text-neutral-800">{blog.author?.name}</strong>
                  </span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}