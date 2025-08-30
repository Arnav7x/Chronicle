import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../axios";

export default function HomePage() {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("newest");

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  // Fetch approved blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs");
        setBlogs(res.data);
        setFilteredBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  // Filter and sort blogs based on search query and filter option
  useEffect(() => {
    let filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterOption === "newest") {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filterOption === "oldest") {
      filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filterOption === "author") {
      filtered = filtered.sort((a, b) => 
        (a.author?.name || "").localeCompare(b.author?.name || "")
      );
    }

    setFilteredBlogs(filtered);
  }, [searchQuery, blogs, filterOption]);

  return (
    <div className="min-h-screen bg-white text-neutral-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 border-b">
        <Link to="/" className="text-xl font-bold text-orange-600">
          Chronicle
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="text-neutral-700 hover:underline">
            Home
          </Link>

          {user ? (
            <div className="relative flex items-center space-x-4">
              {/* Admin dashboard link */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
                >
                  Dashboard
                </Link>
              )}
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
                <div className="absolute right-0 top-12 w-48 bg-white text-black rounded-lg shadow-lg">
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

      {/* Create Post button */}
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

      {/* Homepage hero */}
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold mb-4">Chronicle</h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Thoughtful articles on design, development, and digital experiences.<br />
          Discover insights that matter.
        </p>
      </section>

      {/* Blog section with search bar and filter button */}
      <section className="px-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Latest Articles</h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border rounded-md text-neutral-700 focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
            />
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex items-center space-x-1 text-neutral-700 hover:bg-gray-100 px-3 py-2 rounded-md border transition"
              >
                <span>Filter</span>
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
              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                  <button
                    onClick={() => {
                      setFilterOption("newest");
                      setIsFilterDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-neutral-700"
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() => {
                      setFilterOption("oldest");
                      setIsFilterDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-neutral-700"
                  >
                    Oldest First
                  </button>
                  <button
                    onClick={() => {
                      setFilterOption("author");
                      setIsFilterDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-neutral-700"
                  >
                    By Author
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {filteredBlogs.length === 0 ? (
          <p className="text-neutral-500">No blogs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
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