import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function CreateBlog() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.title.length > 50) {
      toast.error("Title cannot exceed 50 characters");
      return;
    }

    try {
      await api.post("/blogs", { ...form, authorId: user._id });
      toast.success("Blog submitted for admin approval ✅");
      navigate("/");
    } catch {
      toast.error("Error submitting blog");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="p-6 max-w-2xl mx-auto">
      {/* Back button */}
      <Link
        to="/"
        className="inline-block mb-4 text-orange-600 hover:underline"
      >
        ← Back
      </Link>

      <h2 className="text-2xl font-bold mb-4">Create Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="title"
            placeholder="Blog Title"
            value={form.title}
            onChange={handleChange}
            maxLength={50}   // ✅ Enforces max 50 characters
            className="w-full p-3 border rounded-lg"
          />
          <p className="text-sm text-gray-500 mt-1">
            {form.title.length}/50 characters
          </p>
        </div>

        <textarea
          name="content"
          placeholder="Blog Content"
          value={form.content}
          onChange={handleChange}
          rows="8"
          className="w-full p-3 border rounded-lg"
        />

        <button className="bg-orange-500 text-white px-6 py-2 rounded-md">
          Submit
        </button>
      </form>
    </div>
    </>
  );
}
