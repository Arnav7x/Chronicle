import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const articles = [ /* ... keep your articles list as before ... */ ];

export default function HomePage() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-white text-neutral-800">
      {/* ✅ Updated Navbar */}
      <header className="flex justify-between items-center px-8 py-4 border-b">
        <Link to="/" className="text-xl font-bold text-orange-600">
          Chronicle
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="text-neutral-700 hover:underline">
            Home
          </Link>

          {user ? (
            <>
              <span className="text-neutral-700">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </>
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

      {/* ✅ Rest of your HomePage content unchanged */}
      <section className="text-center py-16">
        <h2 className="text-4xl font-bold mb-4">Chronicle</h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Thoughtful articles on design, development, and digital experiences.<br />
          Discover insights that matter.
        </p>
      </section>

      <section className="px-8 max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold mb-6">Latest Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <div key={index} className="shadow-sm border rounded-2xl p-6">
              <h4 className="text-lg font-semibold mb-2">{article.title}</h4>
              <p className="text-sm text-neutral-600 mb-4">{article.description}</p>
              <div className="text-sm text-neutral-500 flex justify-between items-center">
                <span>
                  <strong className="text-neutral-800">{article.author}</strong>
                  <span className="mx-2">•</span> {article.readTime}
                </span>
                <span>{article.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
