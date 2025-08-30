const express = require("express");
const {
  createBlog,
  getApprovedBlogs,
  getPendingBlogs,
  approveBlog,
  rejectBlog,
  hideBlog,
  deleteBlog,
} = require("../controllers/blog.controller");

const router = express.Router();

// User routes
router.post("/", createBlog);       // submit blog (pending)
router.get("/", getApprovedBlogs);  // fetch approved blogs (homepage)

// Admin routes
router.get("/pending", getPendingBlogs);          // view pending blogs
router.patch("/:id/approve", approveBlog);        // approve blog
router.patch("/:id/reject", rejectBlog);          // reject blog
router.patch("/:id/hide", hideBlog);              // hide approved blog
router.delete("/:id", deleteBlog);                // delete blog

module.exports = router;
