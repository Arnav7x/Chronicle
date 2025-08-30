import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateBlog() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/blogs", { ...form, authorId: user._id });
      toast.success("Blog submitted for admin approval ✅");
      navigate("/");
    } catch {
      toast.error("Error submitting blog");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Blog Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />
        <textarea
          name="content"
          placeholder="Blog Content"
          value={form.content}
          onChange={handleChange}
          rows="8"
          className="w-full p-3 border rounded-lg"
        />
        <button className="bg-orange-500 text-white px-6 py-2 rounded-md">Submit</button>
      </form>
    </div>
  );
}
