const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// User: submit new blog (goes to pending, author auto-detected)
exports.createBlog = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "hackathon_secret");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const blog = new Blog({
      title,
      content,
      author: user._id,
      status: "pending",
    });

    await blog.save();
    res.json({ message: "Blog submitted for review", blog });
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ message: "Error creating blog" });
  }
};

// Homepage: fetch only approved blogs
exports.getApprovedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "approved" })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching approved blogs:", err);
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

// Get single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name email");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.status !== "approved") {
      return res.status(403).json({ message: "This blog is not public" });
    }

    res.json(blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ message: "Error fetching blog" });
  }
};

// Admin: view pending blogs
exports.getPendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "pending" })
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching pending blogs:", err);
    res.status(500).json({ message: "Error fetching pending blogs" });
  }
};

// Admin: approve blog
exports.approveBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog approved", blog });
  } catch (err) {
    console.error("Error approving blog:", err);
    res.status(500).json({ message: "Error approving blog" });
  }
};

// Admin: reject blog
exports.rejectBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog rejected", blog });
  } catch (err) {
    console.error("Error rejecting blog:", err);
    res.status(500).json({ message: "Error rejecting blog" });
  }
};

// Admin: hide blog
exports.hideBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status: "hidden" },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog hidden", blog });
  } catch (err) {
    console.error("Error hiding blog:", err);
    res.status(500).json({ message: "Error hiding blog" });
  }
};

// Admin: delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted", blog });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ message: "Error deleting blog" });
  }
};
