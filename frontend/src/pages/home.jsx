import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import Footer from "../components/Footer"; // <-- Import Footer
import api from "../axios";
import { AuthContext } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("newest");

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
    <div className="min-h-screen flex flex-col bg-white text-neutral-800">
      <Navbar />

      <main className="flex-grow">
        <section className="py-12 px-4 text-center border-b">
          {/* Search & Filter Section */}
          <div className="max-w-2xl mx-auto flex items-center justify-center space-x-3">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md text-neutral-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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

            {user && (
              <Link
                to="/create"
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md"
              >
                Create Post
              </Link>
            )}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="mt-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Chronicle</h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Thoughtful articles on design, development, and digital experiences.
                <br />
                Discover insights that matter.
              </p>
            </div>
          )}
        </section>

        {/* Blogs Section */}
        {filteredBlogs.length > 0 && (
          <section className="px-8 max-w-6xl mx-auto mt-8">
            <h3 className="text-xl font-semibold mb-6">Latest Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} /> 
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
