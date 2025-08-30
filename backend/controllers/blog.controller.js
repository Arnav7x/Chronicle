const Blog = require("../models/blog");

// User submits blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    const blog = new Blog({ title, content, author: authorId });
    await blog.save();
    res.json({ message: "Blog submitted for review", blog });
  } catch (err) {
    res.status(500).json({ message: "Error creating blog" });
  }
};

// Homepage: show only approved blogs
exports.getApprovedBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: "approved" }).populate("author", "name");
  res.json(blogs);
};

// Admin: view pending blogs
exports.getPendingBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: "pending" }).populate("author", "name");
  res.json(blogs);
};

// Admin: approve
exports.approveBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
  res.json(blog);
};

// Admin: reject
exports.rejectBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
  res.json(blog);
};
