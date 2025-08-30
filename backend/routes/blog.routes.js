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

module.exports = router;
