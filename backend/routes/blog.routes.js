const express = require("express");
const { createBlog, getApprovedBlogs, getPendingBlogs, approveBlog, rejectBlog } = require("../controllers/blog.controller");

const router = express.Router();

// User
router.post("/", createBlog); // create blog
router.get("/", getApprovedBlogs); // fetch approved blogs

// Admin
router.get("/pending", getPendingBlogs);
router.patch("/:id/approve", approveBlog);
router.patch("/:id/reject", rejectBlog);

module.exports = router;
