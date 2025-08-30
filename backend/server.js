const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");   // <-- only declare once
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const blogRoutes = require("./routes/blog.routes");
const User = require("./models/user");

dotenv.config();
connectDB();

const app = express();

// Seed default admin if not exists
async function seedAdmin() {
  const existingAdmin = await User.findOne({ role: "admin" });
  if (!existingAdmin) {
    await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin"
    });
    console.log("✅ Default admin created (email: admin@example.com / pass: admin123)");
  }
}

seedAdmin();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// API Routes
app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  // Catch-all route to serve React's index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
