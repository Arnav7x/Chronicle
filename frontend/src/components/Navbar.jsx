import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  if (loading) {
    // ✅ prevents flicker before user is loaded
    return (
      <header className="flex justify-between items-center px-8 py-4 border-b">
        <Link to="/" className="text-xl font-bold text-orange-600">
          Chronicle
        </Link>
      </header>
    );
  }

  return (
    <header className="flex justify-between items-center px-8 py-4 border-b">
      <Link to="/" className="text-xl font-bold text-orange-600">
        Chronicle
      </Link>
      {/* Right Menu */}
  <div className="flex items-center space-x-6">
  <Link
    to="/analytics"
    className="text-gray-700 hover:text-orange-600 font-medium"
  >
    Analytics
  </Link>
  <Link
    to="/"
    className="text-gray-700 hover:text-orange-600 font-medium"
  ></Link>
</div> {/* <-- Add this closing tag here */}

      <div className="flex items-center space-x-4">
        <Link to="/" className="text-neutral-700 hover:underline">
          Home
        </Link>

        {user ? (
          <div className="relative flex items-center space-x-4">
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
              >
                Admin Dashboard
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
  );
}
