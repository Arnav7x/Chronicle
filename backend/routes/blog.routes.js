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
  incrementViews,
  toggleLike,
  addComment,
  getAnalytics
} = require("../controllers/blog.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// -------- User Routes --------
router.post("/", verifyToken, createBlog);   // Submit blog (pending review)
router.get("/", getApprovedBlogs);           // Public - Approved blogs
router.get("/:id", getBlogById);             // Public - Single blog by ID

// -------- Blog Interactions --------
router.put("/:id/views", incrementViews);     // Increment views
router.put("/:id/like", toggleLike);          // Like/unlike blog
router.post("/:id/comments", addComment);     // Add comment

// -------- Admin Routes --------
router.get("/pending", verifyToken, isAdmin, getPendingBlogs);
router.patch("/:id/approve", verifyToken, isAdmin, approveBlog);
router.patch("/:id/reject", verifyToken, isAdmin, rejectBlog);
router.patch("/:id/hide", verifyToken, isAdmin, hideBlog);
router.delete("/:id", verifyToken, isAdmin, deleteBlog);

// -------- Analytics (Admin) --------
router.get("/analytics/all", verifyToken, isAdmin, getAnalytics);

module.exports = router;
