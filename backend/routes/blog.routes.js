const express = require("express");
const {
  createBlog,
  getApprovedBlogs,
  getPendingBlogs,
  approveBlog,
  rejectBlog,
  hideBlog,
  deleteBlog,
  getBlogById,
} = require("../controllers/blog.controller");

const { verifyToken } = require("../middlewares/auth.middleware");
const User = require("../models/user");

const router = express.Router();

// middleware to check admin
const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  } catch (err) {
    console.error("Admin check failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// User routes
router.post("/", verifyToken, createBlog);   // submit blog (pending)
router.get("/", getApprovedBlogs);           // approved blogs (homepage)

// ⚠️ put this BEFORE /:id
router.get("/pending", verifyToken, verifyAdmin, getPendingBlogs);

// single blog by id
router.get("/:id", getBlogById);

// Admin routes
router.patch("/:id/approve", verifyToken, verifyAdmin, approveBlog);
router.patch("/:id/reject", verifyToken, verifyAdmin, rejectBlog);
router.patch("/:id/hide", verifyToken, verifyAdmin, hideBlog);
router.delete("/:id", verifyToken, verifyAdmin, deleteBlog);

// Create Blog
router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all blogs
router.get("/", async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

// Increment view count
router.post("/:id/view", async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  );
  res.json(blog);
});

// Like blog
router.post("/:id/like", async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  res.json(blog);
});

// Add comment
router.post("/:id/comment", async (req, res) => {
  const { user, text } = req.body;
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: { user, text } } },
    { new: true }
  );
  res.json(blog);
});

// Analytics Dashboard
router.get("/analytics", async (req, res) => {
  const analytics = await Blog.find({}, "title views likes comments");
  res.json(analytics);
});

module.exports = router;
