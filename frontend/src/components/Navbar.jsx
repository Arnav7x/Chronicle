import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully 👋");
  };

  if (loading) return null; // ✅ avoid flicker before auth state is known

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">VibeHack</Link>

      <div className="space-x-4">
        {user ? (
          <>
            <span>Welcome, {user.name} </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
